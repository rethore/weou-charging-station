import { request } from "http"

const rpcUrl = "http://localhost:8080/"

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
  const res = await doRequest('status')
}

export async function startCharge () {
  const res = await doRequest('start')

}

export function stopCharge () {


}