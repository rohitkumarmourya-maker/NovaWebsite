process.env.SERVE_STATIC = 'true'
process.env.MAIL_DRY_RUN = 'true'
process.env.NODE_ENV = 'development'
await import('../server/src/index.js')
