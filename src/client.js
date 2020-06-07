import 'normalize.css'
import React from 'react'
import ReactDOM from 'react-dom'
import Widget from './Widget/Widget'
import { loadableReady } from '@loadable/component'

import './services/i18n.js'

loadableReady(() => {
  window.nrcStatDrawWidgetQueue.forEach(params => {
    console.log(params)
    ReactDOM.render(<Widget {...params} />, document.querySelector(params.targetSelector))
  })
})
