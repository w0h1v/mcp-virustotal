# Build stage
FROM node:24-slim AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# Runtime stage: production dependencies only
FROM node:24-slim AS runner
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts && npm cache clean --force
COPY --from=builder /app/build ./build

ENV NODE_ENV=production
# Listen on all interfaces so a published port reaches the server. Publish it on
# localhost only (-p 127.0.0.1:3000:3000): the HTTP transport has no authentication.
ENV MCP_HOST=0.0.0.0
# The API key is supplied at runtime: docker run -e VIRUSTOTAL_API_KEY=...
EXPOSE 3000

RUN mkdir -p logs && chown node:node logs
USER node
ENTRYPOINT ["node", "build/index.js"]
