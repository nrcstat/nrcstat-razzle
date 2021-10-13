import 'normalize.css'
import React from 'react'
import ReactDOM from 'react-dom'
import Widget from './Widget/Widget'
import { loadableReady } from '@loadable/component'

import './services/i18n.js'

import { isClient } from './util/utils'

// There's a very good reason we're doing this. In the special case of
// VB (Visualization Builder) using me/Razzle to render widgets, there's
// a rerender happening after every change to the widget object being
// built. We need to provide "this" copy of ReactDOM to VB via window
// to VB, so that VB cnn properly <Widget> so that "this" ReactDOM does
// not compete with the "next" ReactDOM provided in the next render.
//
// See nrcstat-monorepo:libs/widget-social-media-sharing/src/lib/index.ts:13
// for another in-depth comment
if (isClient()) {
  window.razzleReactDOM = ReactDOM
}

loadableReady(() => {
  window.nrcStatDrawWidgetQueue.forEach((params) => {
    ReactDOM.render(
      <Widget {...params} />,
      document.getElementById(params.targetSelector.replace(/#/g, ''))
    )
  })
})
