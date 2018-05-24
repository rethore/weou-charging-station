import { request } from "http"

const rpcUrl = "http://localhost:8080/"

export const responseMock = Object.freeze({
  kW: 22,
  charging: true,
  chargingId: "s0idfj0asjdf0asn",
})

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

  return responseMock
}

export async function startCharge () {
  const res = await doRequest('start')

}

export function stopCharge () {


}