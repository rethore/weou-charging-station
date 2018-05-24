import { request } from "http"

const rpcUrl = "http://localhost:8080/"

export const responseMock = {
  kW: 22,
  chargingId: "s0idfj0asjdf0asn",
  kWhTotal: 42000,
  co2: 34,
  price: 104,
  balance: 0,
  charging: false,
  connected: false,
}

function doRequest (method:string) {
  return new Promise((resolve, reject) => {
    let r = request(rpcUrl + method, res => {
      if (res.statusCode < 300 && res.statusCode >= 200) {
        resolve()
      }
      else {
        reject()
      }
    })
    r.end()
  })
}


export async function pollStatus() {
  // try {
  //   const res = await doRequest('status')
  // }
  // catch (e) {
  //   console.error(e)
  // }

  responseMock.kWhTotal = new Date().getTime() / 10000000
  if (Math.random() > 0.68) {
    responseMock.charging = !responseMock.charging
    responseMock.connected = responseMock.charging
  }
  return responseMock
}

export async function startCharge () {
  const res = await doRequest('start')

}

export function stopCharge () {


}