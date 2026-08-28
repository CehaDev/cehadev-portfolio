# Multi-stage build untuk deploy ke VPS/VM (Oracle, Hostinger VPS, dll).
# Menjalankan web (Nitro) + bot + worker dalam satu container via PM2,
# dengan database file lokal di volume persisten.
#
# Build:  docker build -t chdev .
# Run:    docker compose up -d   (lihat docker-compose.yml)
# Atau:   docker run -d --name chdev -p 3000:3000 --env-file .env -v chdev-data:/srv/data chdev
FROM node:22-slim AS builder
WORKDIR /app
COPY package*.json ./
# ci tidak wajib apabila pakai lockfile tanpa reproducible hash ketat
RUN npm ci || npm install
COPY . .
RUN npm run build

FROM node:22-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
# tidak perlu better-sqlite3/native → image kecil & kompatibel ARM
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/ecosystem.config.cjs ./
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/server ./server
RUN mkdir -p /srv/data
ENV TURSO_DATABASE_URL=file:/srv/data/db.sqlite
VOLUME ["/srv/data"]
# PM2 dalam foreground di container
CMD ["npx", "pm2-runtime", "start", "ecosystem.config.cjs", "--only", "chdev-telegram-bot,chdev-worker,chdev-web"]
