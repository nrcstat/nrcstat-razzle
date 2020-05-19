import pathLib from 'path'
import fs from 'fs'
import React from 'react'
import express from 'express'
import { html as htmlTemplate, oneLineTrim } from 'common-tags'
import { renderToString } from 'react-dom/server'
import { ServerLocation } from '@reach/router'
import { ChunkExtractor, ChunkExtractorManager } from '@loadable/server'
import { transform } from '@babel/core'
import App from './App'
import { determineWidgetType } from './lib/determine-widget-type'

import Widget from './Widget/Widget'

const server = express()
server
  .disable('x-powered-by')
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  /*
  .get('/widgetLib.js', (req, res) => {
    setTimeout(() => {
      res.type('javascript').send('function yalla(){alert("test")}')
    }, 2000)

  })
  */
  .get('/render-widgets', (req, res) => {
    const queue = JSON.parse(req.query.queue)
    const enrichedQueue = queue.map(w => Object.assign(w, { type: determineWidgetType()(w.widgetId) }))

    const extractor = new ChunkExtractor({
      statsFile: pathLib.resolve('build/loadable-stats.json'),
      entrypoints: ['client']
    })

    renderToString(
      <ChunkExtractorManager extractor={extractor}>
        {enrichedQueue.map((props) =>
          <Widget key={props.widgetId} {...props} />
        )}
      </ChunkExtractorManager>
    )

    const payload = {
      __LOADABLE_REQUIRED_CHUNKS__: null,
      widgetQueue: enrichedQueue,
      scripts: []
    }

    const js = extractor.getScriptTags((attrs) => {
      if (attrs) {
        payload.scripts.push({
          'data-chunk': attrs.chunk,
          src: attrs.url
        })
      }
      return attrs || {}
    })
    payload.__LOADABLE_REQUIRED_CHUNKS__ = JSON.parse(/<script.+>(.+)<\/script>/g.exec(js)[1])

    extractor.getStyleTags((attrs) => {
      console.log(attrs)
      return attrs || {}
    })

    res.type('javascript').send(payload)
  })

function extractAssets (widgetQueue) {
  return extractor
}

export default server
