import { request } from "http"

const rpcUrl = "http://localhost:8080/"

export const responseMock = {
  chargingId: "s0idfj0asjdf0asn",
  kW: 22,
  kWhTotal: 42000,
  charging: false,
  connected: true,

  co2: 34,
  price: 104,

  balance: -1,
}

function doRequest (method:"start"|"stop"|"status") {
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
  // if (Math.random() > 0.68) {//
  //   responseMock.charging = !responseMock.charging
  //   responseMock.connected = responseMock.charging
  // }
  return responseMock
}

export async function startCharge () {
  try {
    const res = await doRequest('start')
  }
  catch (e) {

  }
  responseMock.connected =
    responseMock.charging = true
}

export async function stopCharge () {
  try {
    const res = await doRequest('stop')
  }
  catch (e) {

  }

  responseMock.connected = true
  responseMock.charging = false
}