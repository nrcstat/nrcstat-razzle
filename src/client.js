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

// Our widgets render Roboto / Roboto Condensed (CSS vars, charts, map
// labels). We don't ship the font ourselves, so we depend on the host
// page providing it. Some embeds load it via a <script> tag instead of a
// stylesheet, which the browser rejects ("Refused to execute script ...
// MIME type 'text/css'"), leaving Roboto Condensed missing. Inject the
// stylesheet ourselves (once) so widgets look right regardless of embed.
const FONTS_HREF =
  'https://fonts.googleapis.com/css2?family=Roboto+Condensed&family=Roboto:wght@300;400;700&display=swap'

function ensureWidgetFonts() {
  if (!isClient()) return
  if (document.querySelector(`link[rel="stylesheet"][href="${FONTS_HREF}"]`)) {
    return
  }
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = FONTS_HREF
  document.head.appendChild(link)
}

loadableReady(() => {
  ensureWidgetFonts()
  window.nrcStatDrawWidgetQueue.forEach((params) => {
    ReactDOM.render(
      <Widget {...params} />,
      document.getElementById(params.targetSelector.replace(/#/g, ''))
    )
  })
})
