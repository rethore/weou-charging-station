import { httpRequest, ParsedIncomingMessage } from './http-request.js'
import { getValueFieldAsNumber, getValueFieldAsString } from './xml-parsing.js'
import { URL } from 'url'

type ChargingState = {
  chargingId: string,
  kW: number,
  kWhTotal: number,
  charging: boolean,
  connected: boolean,
}

export class ChargingStation {
  readonly id:string
  readonly baseUrl:string

  constructor(id: string, baseUrl:string) {
    this.id = id
    let url = new URL(baseUrl)
    this.baseUrl = `${url}/typebased_WS_EVSE/EVSEWebService/Toppen_EVSE`
  }

  async status():Promise<ChargingState> {
    const results:ParsedIncomingMessage[] = await Promise.all([
      httpRequest(`${this.baseUrl}/getActiveEnergyImport`),
      httpRequest(`${this.baseUrl}/getACActivePower`),
      httpRequest(`${this.baseUrl}/getCurrentLimit`),

      httpRequest(`${this.baseUrl}/getAuthenticatedVehicle`),
    ])

    const [kWhTotal, kW, limit] = results.map(response => getValueFieldAsNumber(response.body))
    const chargingId = getValueFieldAsString(results[3].body)

    const result = <ChargingState>{
      chargingId,
      kWhTotal,
      kW,
      limit,
      charging: kW > 0,
      connected: kW > 0,
    }

    return result
  }

  async startCharge (budget:number):Promise<number> {
    const amps = 32

    await httpRequest(`${this.baseUrl}setCurrentLimit/${amps}`, {
      method: 'PUT'
    })

    const t0 = new Date()
    const maxChargeCycle = 1 // seconds
    let chargeCycle:number = maxChargeCycle
    let status:ChargingState

    do {
      try {
        status = await this.status()
      }
      catch (e) {
        console.log('trouble getting status')
        break
      }

      let wattage:number = status.kW/1000 // = 0.0077 // Mj/s
      let price:number = 200/3.6 // 200 cents/kWh = 200/3.6 cents / 3.6/3.6 Mj = 55.5556 / 1
      // let budget:number = 400 // cents

      if (status.charging) {
        // find time
        const t1 = new Date()
        const elapsedTime_s = (t1.getTime() - t0.getTime()) / 1000
        const cents_s = wattage * price // 0.0077 Mj/s * 55.5556 cents / Mj = 4.2 cents/s
        const subtract = elapsedTime_s * cents_s // s - cents / s
        budget -= subtract // cents
        const budgetInSeconds = calcSeconds(budget, wattage, price)

        chargeCycle = Math.min(maxChargeCycle, budgetInSeconds) // max 1
        await wait(chargeCycle)
      }
    }
    while (chargeCycle > 0)

    await this.stopCharge()

    return budget
  }

  async stopCharge () {
    try {
      await httpRequest(`${this.baseUrl}setCurrentLimit/6`, {
        method: 'PUT'
      })
    }
    catch (e) {
      console.error(e)
    }
  }
}

function calcSeconds(budget_cents:number, wattage_Mjs:number, price_cents:number):number {
  // budget 2 Mj = 400 cents / 200 cents/Mj
  // time 259 s = 2 Mj / 0.0077 Mj/s
  const budget_Mj = budget_cents / price_cents
  const time_s = budget_Mj / wattage_Mjs
  return time_s
}

async function wait (delay:number) {
  return new Promise(resolve => setTimeout(()=> resolve(), delay * 1000))
}
