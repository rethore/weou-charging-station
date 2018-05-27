import * as Koa from 'koa'
import { Context } from 'koa'
import { request } from 'http'
import { ChargingStation } from './hardware.js'
import { getBalanceOf } from './eth.js'

const app = new Koa()

const routes = new Map<string, Function>()

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

routes.set('/start', async (ctx:Context) => {
  const id = ctx.request.query.id
  console.assert(!!id, `missing query parameter 'id'`)
  const chargingStationAddress = ctx.request.query.address
  console.assert(!!chargingStationAddress, `missing query parameter 'address'`)

  const station = new ChargingStation(id)
  const budget = await getBalanceOf(chargingStationAddress)
  station.startCharge(budget) // dont await this, it will run for hours
})

routes.set('/stop', async (ctx:Context) => {
  const id = ctx.request.query.id
  console.assert(!!id, `missing query parameter 'id'`)

  const station = new ChargingStation(id)
  await station.stopCharge()
})

routes.set('/status', async (ctx:Context) => {
  const id = ctx.request.query.id
  console.assert(!!id, `missing query parameter 'id'`)

  const station:ChargingStation = await new ChargingStation(id)
  const response = await station.status()

  const balance = Math.round( Math.random() * 10000) //await getBalanceOf(ctx.request.query.id)

  // console.debug(response)
  const status = Object.freeze({
    chargingId: response.chargingId,
    kW: response.kW,
    kWhTotal: response.kWhTotal,
    charging: response.charging,
    connected: response.connected,

    co2: 34,
    price: 104,

    balance,
  })
  ctx.body = status
})

