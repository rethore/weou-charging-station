import * as Koa from 'koa'
import { Context } from 'koa'
import { request } from 'http'
import { start } from 'repl'
import { pollStatus } from './hardware.js'

const app = new Koa()

const routes = new Map<string, Function>()

routes.set('/start', async (ctx:Context) => {
  console.debug('Start!')
  await start()
  console.debug("start might have been called")

  ctx.body = {
    message: "ok"
  }
})

routes.set('/status', async (ctx:Context) => {
  const response = await pollStatus()
  ctx.body = response
})

const router = (ctx:Context) => {
  console.debug(ctx.method + ' ' + ctx.request.path)
  const fn = routes.get(ctx.request.path)
  if (fn) {
    fn(ctx)
  }
  else {
    console.debug("Didn't find handler for route: " + ctx.request.path)
  }
}

app.use( router)

app.listen((process.env.PORT || 3000), () => {
  console.log("App listening on " + (process.env.PORT || 3000))
  if (process.argv[2] == 'test') {
    console.debug("Testing")
    let r = request("http://localhost:3000/start")
    r.end()
  }
})

