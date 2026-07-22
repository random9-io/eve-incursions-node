FROM node:22-alpine@sha256:16e22a550f3863206a3f701448c45f7912c6896a62de43add43bb9c86130c3e2 AS deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY packages/ws/package.json packages/ws/
COPY packages/server/package.json packages/server/
COPY packages/frontend/package.json packages/frontend/
RUN npm ci --workspace=packages/ws --include-workspace-root

FROM node:22-alpine@sha256:16e22a550f3863206a3f701448c45f7912c6896a62de43add43bb9c86130c3e2 AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=deps /app/node_modules /app/node_modules
COPY packages/ws/ /app/packages/ws/

RUN addgroup -g 1001 -S appgroup && \
    adduser -S appuser -u 1001 -G appgroup
USER appuser

WORKDIR /app/packages/ws
EXPOSE 4003
CMD ["npx", "tsx", "src/index.ts"]
