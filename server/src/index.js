import app from './app.js'
import { config } from './config.js'
import { closeTransport, verifyTransport } from './mailer.js'

const server = app.listen(config.port, async () => {
  console.log(`Nova Ventures API: http://localhost:${config.port}`)
  console.log(await verifyTransport() ? 'Mail transport ready.' : 'Mail transport unavailable: configure server/.env before using forms.')
})
for (const signal of ['SIGTERM', 'SIGINT']) {
  process.on(signal, () => { closeTransport(); server.close(() => process.exit(0)) })
}
