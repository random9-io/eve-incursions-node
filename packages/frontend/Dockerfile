FROM node:22-alpine@sha256:16e22a550f3863206a3f701448c45f7912c6896a62de43add43bb9c86130c3e2 AS deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY packages/frontend/package.json packages/frontend/
COPY packages/server/package.json packages/server/
COPY packages/ws/package.json packages/ws/
RUN npm ci --workspace=packages/frontend --include-workspace-root

FROM node:22-alpine@sha256:16e22a550f3863206a3f701448c45f7912c6896a62de43add43bb9c86130c3e2 AS builder
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules /app/node_modules
COPY --from=deps /app/packages/frontend/node_modules /app/packages/frontend/node_modules
COPY packages/frontend/ /app/packages/frontend/

WORKDIR /app/packages/frontend
RUN npx next build

FROM node:22-alpine@sha256:16e22a550f3863206a3f701448c45f7912c6896a62de43add43bb9c86130c3e2 AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/packages/frontend/.next/standalone /app
COPY --from=builder /app/packages/frontend/.next/static /app/packages/frontend/.next/static
COPY --from=builder /app/packages/frontend/public /app/packages/frontend/public

RUN addgroup -g 1001 -S appgroup && \
    adduser -S appuser -u 1001 -G appgroup
USER appuser

EXPOSE 3000
CMD ["node", "packages/frontend/server.js"]
