import pathLib from 'path'
import fs from 'fs'
import React from 'react'
import express from 'express'
import cors from 'cors'
import { html as htmlTemplate, oneLineTrim } from 'common-tags'
import { renderToString } from 'react-dom/server'
import { ServerLocation } from '@reach/router'
import { ChunkExtractor, ChunkExtractorManager } from '@loadable/server'
import { transform } from '@babel/core'
import { mapValues } from 'lodash'
import App from './App'
import { determineWidgetType } from './lib/determine-widget-type'

import Widget from './Widget/Widget'

import { loadWidgetData as loadGlobalMapData } from './Widget/GlobalMap/loadWidgetData.js'

/// import i18n service to initialize it
import { i18n } from './server-only/locale-service.js'
import { mapNestedObjectToPathKeyedObject } from './util/mapNestedObjectToPathKeyedObject'

const dataPreLoaders = {
  GlobalMap: loadGlobalMapData
}

const server = express()

server.use(cors())

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
  .get('/render-widgets', async (req, res) => {
    const rawQueue = JSON.parse(req.query.queue)
    const enrichedQueue = rawQueue.map(w => Object.assign(w, { ...determineWidgetType()(w.widgetId) }))
    // TODO: replace this with a Promise.all() method to load all data in parallel
    for (let i = 0; i < enrichedQueue.length; i++) {
      const widget = enrichedQueue[i]
      const dataLoader = dataPreLoaders[widget.type]
      if (dataLoader) {
        const data = await dataLoader(2018)
        widget.preloadedWidgetData = data
      }
    }

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

    const languageLocaleData = mapValues(
      i18n.getDataByLanguage(enrichedQueue[0].locale),
      namespace => mapNestedObjectToPathKeyedObject(namespace)
    )

    const payload = {
      localeTranslation: { [enrichedQueue[0].locale]: languageLocaleData, ...languageLocaleData },
      __LOADABLE_REQUIRED_CHUNKS__: null,
      widgetQueue: enrichedQueue,
      scripts: [],
      links: []
    }

    const js = extractor.getScriptTags((attrs) => {
      if (attrs) {
        let scriptUrl = attrs.url
        console.log(process.env.NODE_ENV)
        if (process.env.NODE_ENV === 'production') {
          scriptUrl = scriptUrl.replace(/^((http|https):\/\/localhost:\d+)/g, '')
          scriptUrl = process.env.RAZZLE_URL + scriptUrl
        }

        payload.scripts.push({
          'data-chunk': attrs.chunk,
          src: scriptUrl
        })
      }
      return attrs || {}
    })
    payload.__LOADABLE_REQUIRED_CHUNKS__ = JSON.parse(/<script.+>(.+)<\/script>/g.exec(js)[1])

    extractor.getStyleTags((attrs) => {
      console.log(attrs)
      if (attrs) {
        let linkUrl = attrs.url
        console.log(process.env.NODE_ENV)
        if (process.env.NODE_ENV === 'production') {
          linkUrl = linkUrl.replace(/^((http|https):\/\/localhost:\d+)/g, '')
          linkUrl = process.env.RAZZLE_URL + linkUrl
        }

        payload.links.push(linkUrl)
      }
      return attrs || {}
    })

    res.type('javascript').send(payload)
  })

export default server
