/**
 * PM2 Ecosystem — PRD Section 17 & Phase 8
 * Proses persisten yang TIDAK cocok di platform serverless (Vercel):
 *   - telegram-bot   : polling Telegram Bot API (selalu hidup)
 *   - worker          : scheduler publish + monitoring + backup + alert (loop)
 * Website Nitro dapat dijalankan juga di sini (VPS) atau tetap di serverless.
 *
 * Setup (dijalankan di VPS selama deploy):
 *   cp .env /srv/cehadev/.env        # secret diisi manual, tidak di-commit
 *   pm2 startOrRestart ecosystem.config.cjs
 *   pm2 save
 *   pm2 startup                       # aktif saat reboot (ikuti output)
 *
 * Semua app memuat env dari file .env (Node >=20.6 via --env-file).
 * Jika Node/path env berbeda, sesuaikan `env_file` / `interpreter`.
 */
module.exports = {
  apps: [
    {
      name: 'chdev-telegram-bot',
      cwd: __dirname,
      script: 'scripts/telegram-bot-v2.mjs',
      node_args: '--env-file=.env',
      interpreter: 'node',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,            // restart otomatis bila crash
      max_memory_restart: '300M',   // restart bila bocor memori
      restart_delay: 5000,          // jeda sebelum restart agar tidak menggila
      time: true,
      env: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'chdev-worker',
      cwd: __dirname,
      script: 'scripts/worker.mjs',
      node_args: '--env-file=.env',
      interpreter: 'node',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      max_memory_restart: '300M',
      restart_delay: 5000,
      time: true,
      env: {
        NODE_ENV: 'production',
        SCHEDULER_INTERVAL_MS: '60000',
        MONITOR_INTERVAL_MS: '300000',
        BACKUP_CRON_MS: '86400000',
        BACKUP_RETENTION_DAYS: '7'
      }
    },
    {
      name: 'chdev-web',
      cwd: __dirname,
      script: '.output/server/index.mjs',
      node_args: '--env-file=.env',
      interpreter: 'node',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      max_memory_restart: '500M',
      restart_delay: 3000,
      time: true,
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    }
  ]
}
