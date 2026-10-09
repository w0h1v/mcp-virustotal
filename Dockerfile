# Build stage
FROM node:25-slim AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# Runtime stage: production dependencies only
FROM node:25-slim AS runner
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts && npm cache clean --force
COPY --from=builder /app/build ./build

ENV NODE_ENV=production
# The API key is supplied at runtime: docker run -e VIRUSTOTAL_API_KEY=...
EXPOSE 3000

USER node
ENTRYPOINT ["node", "build/index.js"]
