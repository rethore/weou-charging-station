import { IncomingMessage, request, RequestOptions } from 'http'
import { URL } from 'url'

export function httpRequest (urlString:string, opts?:RequestOptions):Promise<ParsedIncomingMessage> {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(urlString)
    let data:string = ''
    let res:IncomingMessage
    let req = request(<URL & RequestOptions>{
      ...urlObj,
      ...opts,
    }, _res => res = _res)

    req.setTimeout(5000)
    req.on('data', chunk => data += chunk.toString())
    req.on('error', err => reject(err))
    req.on('end', () => {
      let json:object
      let error:Error

      if (/^application\/json/.test(res.headers['content-type'])) {
        try {
          json = JSON.parse(data)
        }
        catch (e) {
          console.log(e)
          error = new Error(e.toString())
        }
      }

      const result = <ParsedIncomingMessage>{
        error,
        json,
        body: data,
        statusCode: res.statusCode,
        headers: res.headers,
      }
      resolve(result)
    })

    req.end() // send it off!
  })
}

export type Response = {
  body: any,
  error: Error,
  json: any,
}

export type ParsedIncomingMessage = IncomingMessage & Response