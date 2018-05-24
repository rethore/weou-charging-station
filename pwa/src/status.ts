import { html, render } from '../node_modules/lit-html/src/lit-html.js'
import { doRequest } from './main.js'

const delay = 2 * 1000

async function poll (loop:boolean) {
  let json
  try {
    json = await doRequest('status')
  }
  catch (e) {
    loop = false
    console.error(e)
    console.error("Stopped polling")
  }

  if (json) {
    update(json)
  }

  if (loop) {
    setTimeout(() => poll(loop), delay)
  }
}

export function init() {
  update({
    co2: -1,
    price: -1,
    balance: -1,
    charging: false,
    connected: false
  })
  poll(true)
}

function update (state:State) {
  const template = html`
  <div>
    <p>CO2/kWh: ${state.co2}</p>
    <p>Price: ${state.price} SVLN = 1 kWh</p>
    <p>Balance on the station: <span>${state.balance}</span> SVLN
    <p><button class="button expanded large warning ${state.charging ? 'hide' : ''}">CONNECT CAR</button>
    <p><button class="button expanded large success ${state.charging ? '' : 'hide'}">CHARGING</button>
  </div>
  
  <button class="button expanded large primary charging-controls__start ${state.charging ? 'hide' : ''}">START</button>
  <button class="button expanded large secondary charging-controls__stop ${state.charging ? '' : 'hide'}">STOP</button>
`
  render(template,   document.querySelector('charging-status'))

  document.querySelector('.charging-controls__start').addEventListener('click', () => doRequest('start'))
  document.querySelector('.charging-controls__stop').addEventListener('click', () => console.debug("STOP hammertime"))
}

interface State {
  co2:number
  price:number
  balance:number
  charging:boolean
  connected:boolean
}

