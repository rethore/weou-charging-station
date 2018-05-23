
export function init(window:any) {

  const document = window.document

  document.querySelector('.charging-controls__start').addEventListener('click', () => start())
  document.querySelector('.charging-controls__stop').addEventListener('click', () => {
    console.debug("STOP hammertime")
  })
}

const apiUrl = 'http://localhost:3000/'

async function start () {
  const json = await doRequest('start')
  console.debug(json)
}

async function doRequest (method: string) {
  const res = await fetch(apiUrl + method, {
    mode: 'cors',
    cache: 'no-cache',
  })
  const json = await res.json()
  return json
}
