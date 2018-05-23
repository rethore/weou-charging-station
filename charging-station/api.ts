import * as Koa from 'koa'
import { request } from 'http'
import { Context } from 'koa'
import { start } from 'repl'

const app = new Koa()

const routes = new Map<string, Function>()

routes.set('/start', async (ctx:Context) => {
  console.debug('Start!')
  await start()
  console.debug("start might have been called")

  ctx.body = {
    message: "ok"
  }
  ctx.toJSON()
})

routes.set('/status', async (ctx:Context) => {
  console.debug('Status')
})

const router = (ctx:Context) => {
  console.debug(ctx.method + ' ' + ctx.request.path)
  const fn = routes.get(ctx.request.path)
  if (fn) {
    fn(ctx)
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

