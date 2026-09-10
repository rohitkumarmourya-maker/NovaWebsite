import dotenv from 'dotenv'
import { fileURLToPath } from 'node:url'

// Resolve from this module, never the shell working directory. Deployment variables win.
dotenv.config({ path: fileURLToPath(new URL('../.env', import.meta.url)), quiet: true })
