
export function init(window:any) {

  const document = window.document

  document.querySelector('.charging-controls__start').addEventListener('click', () => doRequest('start'))
  document.querySelector('.charging-controls__stop').addEventListener('click', () => {
    console.debug("STOP hammertime")
  })

  poll(true)
}

async function poll (loop:boolean) {
  const delay = 2 * 1000

  try {
    const json = await doRequest('status')
    console.debug(json)
  }
  catch (e) {
    loop = false
    console.error(e)
    console.error("Stopped polling")
  }

  if (loop) {
    setTimeout(() => poll(loop), delay)
  }
}

const apiUrl = 'http://localhost:3000/'

async function doRequest (method: "start"|"status") {
  const res = await fetch(apiUrl + method, {
    mode: 'cors',
    cache: 'no-cache',
  })
  const json = await res.json()
  return json
}
