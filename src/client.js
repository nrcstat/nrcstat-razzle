import 'normalize.css'
import React from 'react'
import ReactDOM from 'react-dom'
import Widget from './Widget/Widget'
import { loadableReady } from '@loadable/component'

loadableReady(() => {
  window.nrcStatDrawWidgetQueue.forEach(params => {
    ReactDOM.render(<Widget {...params} />, document.querySelector(params.targetSelector));
  })
})
