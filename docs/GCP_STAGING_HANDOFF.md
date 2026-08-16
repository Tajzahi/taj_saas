# GCP staging handoff — Patch Packet 01

This handoff describes the reviewed sandbox changes for the first Cloud Run staging milestone.

## Scope

- Project: `tajsaas-staging`
- Region: `asia-southeast2`
- Artifact Registry: `asia-southeast2-docker.pkg.dev/tajsaas-staging/taj-saas`
- First target: Customer app image
- Docker image build: Node 20
- Cloud Run deployment: intentionally paused until the local Docker build passes
- Database: Neon remains unchanged
- Netlify and production DNS: unchanged

## Files in this packet

- `.dockerignore`
- `Dockerfile`
- `cloudbuild.yaml`
- `.env.example`
- `apps/customer/next.config.ts`
- `apps/admin/next.config.ts`
- `apps/owner/next.config.ts`
- `apps/customer/middleware.ts`
- `apps/admin/middleware.ts`
- `apps/owner/package.json`
- `pnpm-lock.yaml`

The Next.js configs use `output: "standalone"` and trace from the monorepo root. The Owner start script now respects Cloud Run's `PORT`. Customer/Admin registration fallback no longer contains a Netlify URL; it uses `OWNER_APP_URL`.

## Important local state rules

- Work only on `feature/gcp-staging`.
- Do not push directly to `main`.
- Do not delete or modify `docs/laporancus.md`.
- Do not include `.env` files or secret values in a commit or Docker context.
- Do not run database migrations, seed scripts, or destructive SQL.
- Do not deploy Cloud Run or change DNS until the local Docker build passes and the diff is reviewed.

## Apply/compare in the local checkout

The local AI must compare its draft with the packet files above and use the packet version for any conflict. It must not keep an older draft Dockerfile or cloudbuild file just because it already exists.

Check the resulting diff:

```bash
git status --short
git diff --check
git diff --stat
```

Generated `apps/admin/next-env.d.ts` and `apps/customer/next-env.d.ts` changes should not be included unless they are explicitly required; the packet does not change those files.

## Required validation

The host Node version is not sufficient proof. Run the Docker build with Node 20:

```bash
docker build --progress=plain \
  --build-arg APP=customer \
  -t taj-customer:local \
  .
```

The build must complete successfully. The image should expose port `8080` and contain:

```text
apps/customer/server.js
apps/customer/.next/static/
```

A host build can also be run with local-only dummy variables, but never use production secrets in a local build log:

```bash
DATABASE_URL='postgresql://local:local@localhost:5432/local?sslmode=require' \
BETTER_AUTH_SECRET='local-build-only-secret-1234567890' \
BETTER_AUTH_URL='http://localhost:3000' \
NEXT_PUBLIC_BETTER_AUTH_URL='http://localhost:3000' \
COOKIE_DOMAIN='.localhost' \
OWNER_APP_URL='http://localhost:3002' \
NEXT_PUBLIC_TENANT_SLUG='taj-saas' \
pnpm --filter @taj-saas/customer build
```

## Cloud Build — after local Docker success only

With the GCP project selected:

```bash
gcloud builds submit \
  --config=cloudbuild.yaml \
  --substitutions=_APP=customer,_IMAGE=customer-app \
  .
```

The current `cloudbuild.yaml` only builds and pushes an immutable `$BUILD_ID` image. It intentionally does not deploy Cloud Run.

Expected image pattern:

```text
asia-southeast2-docker.pkg.dev/tajsaas-staging/taj-saas/customer-app:<BUILD_ID>
```

## Validation already completed in the Arena sandbox

- `pnpm install --frozen-lockfile`: passed after adding the missing `@playwright/test` importer to `pnpm-lock.yaml`.
- Customer build with local-only dummy environment: passed.
- Admin build with local-only dummy environment: passed.
- Owner build with local-only dummy environment: passed.
- `pnpm lint`: passed with one pre-existing warning in `apps/owner/app/actions/settings.ts` and zero errors.
- Standalone output contains `apps/<app>/server.js` for customer, admin, and owner.
- Docker binary is not available in the Arena sandbox, so the Docker image itself must be built by the local AI.