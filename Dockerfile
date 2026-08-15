# Cloud Run image for any Taj SaaS Next.js app in the monorepo.
# Build with:
# docker build --build-arg APP=customer -t taj-customer:local .

FROM node:20-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable \
  && corepack prepare pnpm@9.15.4 --activate

ARG APP=customer
ENV APP="${APP}"
WORKDIR /app

FROM base AS deps

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/customer/package.json ./apps/customer/package.json
COPY apps/admin/package.json ./apps/admin/package.json
COPY apps/owner/package.json ./apps/owner/package.json
COPY packages/config/package.json ./packages/config/package.json
COPY packages/db/package.json ./packages/db/package.json
COPY packages/shared/package.json ./packages/shared/package.json
COPY packages/ui/package.json ./packages/ui/package.json

RUN pnpm install --frozen-lockfile

FROM base AS builder

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps ./apps
COPY --from=deps /app/packages ./packages
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Build-only placeholder.
# Runtime production secret must be injected through Cloud Run Secret Manager.
ARG BUILD_BETTER_AUTH_SECRET=build-only-not-a-runtime-secret
ENV BETTER_AUTH_SECRET="${BUILD_BETTER_AUTH_SECRET}"

# NEXT_PUBLIC_* vars must be baked into the JS bundle at build time.
# They are passed via --build-arg from Cloud Build (pulled from Secret Manager).
# DO NOT inject these at Cloud Run runtime — it will have no effect on the browser bundle.
ARG NEXT_PUBLIC_BETTER_AUTH_URL
ARG NEXT_PUBLIC_ABLY_API_KEY
ARG NEXT_PUBLIC_SENTRY_DSN
ARG NEXT_PUBLIC_POSTHOG_KEY
ARG NEXT_PUBLIC_TENANT_SLUG

ENV NEXT_PUBLIC_BETTER_AUTH_URL="${NEXT_PUBLIC_BETTER_AUTH_URL}"
ENV NEXT_PUBLIC_ABLY_API_KEY="${NEXT_PUBLIC_ABLY_API_KEY}"
ENV NEXT_PUBLIC_SENTRY_DSN="${NEXT_PUBLIC_SENTRY_DSN}"
ENV NEXT_PUBLIC_POSTHOG_KEY="${NEXT_PUBLIC_POSTHOG_KEY}"
ENV NEXT_PUBLIC_TENANT_SLUG="${NEXT_PUBLIC_TENANT_SLUG}"

RUN pnpm --filter "@taj-saas/${APP}" build

RUN mkdir -p "apps/${APP}/public"

FROM node:20-alpine AS runner

ARG APP=customer
ENV APP="${APP}"
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=8080
ENV HOSTNAME="0.0.0.0"

WORKDIR /app

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

COPY --from=builder /app/apps/${APP}/public ./apps/${APP}/public
COPY --from=builder --chown=nextjs:nodejs /app/apps/${APP}/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/${APP}/.next/static ./apps/${APP}/.next/static

USER nextjs

EXPOSE 8080

CMD ["sh", "-c", "exec node apps/${APP}/server.js"]
