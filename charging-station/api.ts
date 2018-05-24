import * as Koa from 'koa'
import { Context } from 'koa'
import { request } from 'http'
import { pollStatus, startCharge, stopCharge } from './hardware.js'
import { getAddress, getBalanceOf, } from './eth.js'

const app = new Koa()

const routes = new Map<string, Function>()

routes.set('/start', async (ctx:Context) => {
  await startCharge()
})

routes.set('/stop', async (ctx:Context) => {
  await stopCharge()
})

routes.set('/status', async (ctx:Context) => {
  console.debug(ctx.request.query)
  const response = await pollStatus()
  response.balance = 42 //await getBalanceOf(ctx.request.query.id)

  // console.debug(response)
  ctx.body = response
})

const router = async (ctx:Context) => {
  console.debug(ctx.method, ctx.request.path, ctx.request.originalUrl)
  const fn = routes.get(ctx.request.path)
  if (fn) {
    await fn(ctx)
  }
  else {
    console.log("Didn't find handler for route: " + ctx.request.path)
  }
}

app.use( router)

app.listen((process.env.PORT || 3000), () => {
  console.log("App listening on " + (process.env.PORT || 3000))
  if (process.argv[2] == 'test') {
    let data = ''
    request("http://localhost:3000/status?id=0x51f8a5d539582eb9bf2f71f66bcc0e6b37abb7ca", res => {
        console.log(res.statusCode, res.statusMessage)
        res.on('data', chunk => data += chunk)
        res.on('end', () => console.log(data))
      })
      .end()
  }
})

