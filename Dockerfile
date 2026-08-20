FROM node:22-slim AS base

RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# Simpan data awal content/ untuk inisialisasi volume
RUN cp -r /app/content /app/content-init

FROM node:22-slim AS runner

RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=base /app/.output ./.output
COPY --from=base /app/node_modules/better-sqlite3 ./node_modules/better-sqlite3
COPY --from=base /app/content-init ./content-init
COPY --from=base /app/docker/entrypoint.sh ./entrypoint.sh

RUN chmod +x ./entrypoint.sh

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

ENTRYPOINT ["./entrypoint.sh"]
