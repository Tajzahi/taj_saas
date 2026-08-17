import { NextResponse } from 'next/server';
import Ably from 'ably';
import { requireTenantSession, AuthorizationError } from '@lib/tenant-authorization';

export async function GET() {
  try {
    const apiKey = process.env.ABLY_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'ABLY_API_KEY is not configured on server' },
        { status: 500 }
      );
    }

    // 1. Authenticate staff session & resolve tenant
    const { tenant, user } = await requireTenantSession({ expectedApp: 'admin' });

    // 2. Instantiate Ably REST client on server
    const rest = new Ably.Rest(apiKey);

    // 3. Issue restricted token request with capability only to subscribe to this tenant's orders channel
    const tokenParams: Ably.TokenParams = {
      clientId: `admin:${user.id}`,
      capability: JSON.stringify({
        [`orders:${tenant.slug}`]: ['subscribe'],
      }),
      ttl: 3600 * 1000, // 1 hour
    };

    const tokenRequest = await rest.auth.createTokenRequest(tokenParams);
    return NextResponse.json(tokenRequest);
  } catch (err: unknown) {
    if (err instanceof AuthorizationError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    const message = err instanceof Error ? err.message : 'Failed to create Ably token';
    console.error('[Ably Token Route] Unexpected error:', err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
