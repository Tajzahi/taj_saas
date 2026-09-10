import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { clearStoreCache } from "@/lib/db/menuService";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");

    if (slug) {
      clearStoreCache(`settings:${slug}`);
      clearStoreCache(`menu:${slug}`);
      clearStoreCache(`categories:${slug}`);
      clearStoreCache(`promos:${slug}`);
    } else {
      clearStoreCache();
    }

    revalidatePath("/");
    revalidatePath("/menu");

    return NextResponse.json({ success: true, revalidated: true, slug: slug || "all" });
  } catch (err) {
    console.error("[api/revalidate] Error clearing cache:", err);
    return NextResponse.json({ success: false, error: "Gagal revalidasi cache" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  return POST(req);
}
