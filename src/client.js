import 'normalize.css'
import React from 'react'
import ReactDOM from 'react-dom'
import Widget from './Widget/Widget'
import { hydrate } from 'react-dom'
import { loadableReady } from '@loadable/component'
import App from './App'

const root = document.getElementById('root')


console.log("i am alive!")
console.log("checking window")

if (window.nrcStatDrawWidgetQueue) {
  console.time("loadableReady")
  loadableReady(() => {
    console.timeEnd("loadableReady")
    window.nrcStatDrawWidgetQueue.forEach(params => {
      ReactDOM.render(<Widget {...params} />, document.querySelector(params.targetSelector));
    })
  })
}

/*

loadableReady(() => {
  hydrate(<App />, root)
})

if (module.hot) {
  module.hot.accept()
}

console.log("i am alive!")
*/