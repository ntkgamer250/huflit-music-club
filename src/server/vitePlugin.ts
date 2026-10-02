import type { Plugin } from 'vite'
import { initDatabase } from './db.ts'
import { handleApiRequest } from './routes.ts'

export function recruitmentApiPlugin(): Plugin {
  return {
    name: 'hmc-recruitment-api-plugin',
    configureServer(server) {
      // Initialize Database on server start
      initDatabase()

      // Intercept /api/* requests
      server.middlewares.use(async (req, res, next) => {
        if (req.url && req.url.startsWith('/api')) {
          const handled = await handleApiRequest(req, res)
          if (handled) return
        }
        next()
      })
    },
    configurePreviewServer(server) {
      initDatabase()
      server.middlewares.use(async (req, res, next) => {
        if (req.url && req.url.startsWith('/api')) {
          const handled = await handleApiRequest(req, res)
          if (handled) return
        }
        next()
      })
    },
  }
}
