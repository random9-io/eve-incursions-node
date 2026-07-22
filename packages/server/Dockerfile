FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY packages/server/package.json packages/server/
COPY packages/ws/package.json packages/ws/
COPY packages/frontend/package.json packages/frontend/
RUN npm ci --workspace=packages/server --include-workspace-root

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=deps /app/node_modules /app/node_modules
COPY --from=deps /app/packages/server/node_modules /app/packages/server/node_modules
COPY package.json /app/
COPY packages/server/ /app/packages/server/

RUN addgroup -g 1001 -S appgroup && \
    adduser -S appuser -u 1001 -G appgroup
USER appuser

WORKDIR /app/packages/server
EXPOSE 4001
CMD ["npm", "run", "prod"]
