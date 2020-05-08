import pathLib from 'path'
import fs from 'fs'
import React from 'react'
import express from 'express'
import { html as htmlTemplate, oneLineTrim } from 'common-tags'
import { renderToString } from 'react-dom/server'
import { ServerLocation } from '@reach/router'
import { ChunkExtractor, ChunkExtractorManager } from '@loadable/server'
import App from './App'

import Widget from './Widget/index'

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
    const extractor = new ChunkExtractor({
      statsFile: pathLib.resolve('build/loadable-stats.json'),
      entrypoints: ['client'],
    })

    const html = renderToString(
      <ChunkExtractorManager extractor={extractor}>
        {queue.map(({widgetId}) => <Widget key={widgetId} />)}
      </ChunkExtractorManager>,
    )

    const js = extractor.getScriptTags()
    const urlMatcher = /src="(.+)"/g
    const jsChunksPaths = [...js.matchAll(urlMatcher)].map(([_, match]) => match).map(path => path.replace('http://localhost:3001', ''))
    
    const pathsResolved = jsChunksPaths.map(path => pathLib.resolve(`${__dirname}/public/${path}`))

    const jsFilesContents = pathsResolved.map(path => fs.readFileSync(path, 'utf8')).join(`\n`)

    const renderingCode = `
    
`
    
    res.type('javascript').send(jsFilesContents + `console.log("yalla")`)
  })
  .get('/render-widgets/css', (req, res) => {
    const queue = JSON.parse(req.query.queue)
    const extractor = new ChunkExtractor({
      statsFile: pathLib.resolve('build/loadable-stats.json'),
      entrypoints: ['client'],
    })

    const html = renderToString(
      <ChunkExtractorManager extractor={extractor}>
        {queue.map(({widgetId}) => <Widget key={widgetId} />)}
      </ChunkExtractorManager>,
    )

    extractor.getCssString().then(css => {
      res.type('css').send(css)
     })
  })

export default server
