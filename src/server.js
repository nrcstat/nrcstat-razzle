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
 .get('/render-widgets/js', (req, res) => {
    const queue = JSON.parse(req.query.queue)
    const enrichedQueue = preProcessWidgetQueue(queue)
    console.log(enrichedQueue)
    const extractor = extractAssets(enrichedQueue)

    const js = extractor.getScriptTags()
    const urlMatcher = /src="(.+)"/g
    const jsChunksPaths = [...js.matchAll(urlMatcher)].map(([_, match]) => match).map(path => path.replace('http://localhost:3001', ''))
    
    const pathsResolved = jsChunksPaths.map(path => pathLib.resolve(`${__dirname}/public/${path}`))

    console.log(pathsResolved)

    const jsFilesContents = pathsResolved.map(path => fs.readFileSync(path, 'utf8')).join(`\n`)

    const renderingCode = `
    \n\n
      window.nrcStatDrawWidgetQueue = ${JSON.stringify(enrichedQueue)}
`
    const result = transform(renderingCode, {
      presets: ["@babel/preset-react"]//, "@babel/preset-env", "minify"]
    })

    console.log(result.code)
    
    res.type('javascript').send(result.code + jsFilesContents)
  })
  .get('/render-widgets/css', (req, res) => {
    const queue = JSON.parse(req.query.queue)
    const extractor = extractAssets(queue)

    extractor.getCssString().then(css => {
      res.type('css').send(css)
     })
  })

function preProcessWidgetQueue(queue) {
  return queue.map(w => Object.assign(w, { type: determineWidgetType()(w.widgetId) }))
}

function extractAssets(widgetQueue) {
  const extractor = new ChunkExtractor({
    statsFile: pathLib.resolve('build/loadable-stats.json'),
    entrypoints: ['client'],
  })

  renderToString(
    <ChunkExtractorManager extractor={extractor}>
      {widgetQueue.map((props) => 
        <Widget key={props.widgetId} {...props} />
      )}
    </ChunkExtractorManager>,
  )

  return extractor
}

export default server
