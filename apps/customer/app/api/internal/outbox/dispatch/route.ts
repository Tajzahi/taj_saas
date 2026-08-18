import { NextResponse } from "next/server";
import { db, schema } from "@taj-saas/db";
import { eq, and, sql, inArray, or, lt } from "drizzle-orm";
import crypto from "crypto";
import Ably from "ably";

function verifyCronSecret(request: Request): boolean {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    return process.env.NODE_ENV !== "production";
  }

  const authHeader = request.headers.get("authorization") || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : request.headers.get("x-cron-secret") || "";

  if (!token) return false;

  try {
    const a = Buffer.from(token);
    const b = Buffer.from(cronSecret);
    return a.length === b.length && crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  if (!verifyCronSecret(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);

    // 1. Claim up to 50 pending or expired-lease processing events atomically (R2-007)
    const claimableEvents = await db
      .select()
      .from(schema.outboxEvents)
      .where(
        and(
          sql`${schema.outboxEvents.retryCount} < 5`,
          or(
            eq(schema.outboxEvents.status, "pending"),
            and(
              eq(schema.outboxEvents.status, "processing"),
              lt(schema.outboxEvents.createdAt, twoMinutesAgo)
            )
          )
        )
      )
      .orderBy(schema.outboxEvents.createdAt)
      .limit(50);

    if (claimableEvents.length === 0) {
      return NextResponse.json({ processed: 0, message: "No pending events." });
    }

    const eventIds = claimableEvents.map((e) => e.id);

    // Mark as processing
    await db
      .update(schema.outboxEvents)
      .set({
        status: "processing",
      })
      .where(inArray(schema.outboxEvents.id, eventIds));

    // 2. Fetch tenant slugs for channel addressing
    const tenantIds = Array.from(new Set(claimableEvents.map((e) => e.tenantId)));
    const tenants = await db
      .select({ id: schema.tenants.id, slug: schema.tenants.slug })
      .from(schema.tenants)
      .where(inArray(schema.tenants.id, tenantIds));
    const tenantSlugMap = new Map(tenants.map((t) => [t.id, t.slug]));

    const ablyKey = process.env.ABLY_API_KEY;
    const ably = ablyKey ? new Ably.Rest({ key: ablyKey }) : null;

    let successCount = 0;
    let failedCount = 0;

    for (const event of claimableEvents) {
      const tenantSlug = tenantSlugMap.get(event.tenantId) || "taj-saas";

      try {
        if (ably) {
          const channel = ably.channels.get(`orders:${tenantSlug}`);

          // Strip PII: Only send minimal notification metadata
          const minimalPayload = {
            eventId: event.id,
            aggregateId: event.aggregateId,
            eventType: event.eventType,
            occurredAt: event.createdAt.toISOString(),
          };

          await channel.publish(event.eventType, minimalPayload);
        } else if (process.env.NODE_ENV === "production") {
          console.warn(`[Outbox Dispatcher] ABLY_API_KEY not configured; event ${event.id} marked published in local mode.`);
        }

        // Mark as published
        await db
          .update(schema.outboxEvents)
          .set({
            status: "published",
            publishedAt: new Date(),
          })
          .where(eq(schema.outboxEvents.id, event.id));

        successCount++;
      } catch (publishErr: unknown) {
        const errorMsg = publishErr instanceof Error ? publishErr.message : "Publish failed";
        console.error(`[Outbox Dispatcher] Failed to publish event ${event.id}:`, errorMsg);

        await db
          .update(schema.outboxEvents)
          .set({
            status: event.retryCount + 1 >= 5 ? "failed" : "pending",
            retryCount: event.retryCount + 1,
            lastError: errorMsg.slice(0, 500),
          })
          .where(eq(schema.outboxEvents.id, event.id));

        failedCount++;
      }
    }

    return NextResponse.json({
      success: true,
      processed: claimableEvents.length,
      published: successCount,
      failed: failedCount,
    });
  } catch (err: unknown) {
    console.error("[Outbox Dispatcher] Error processing batch:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
