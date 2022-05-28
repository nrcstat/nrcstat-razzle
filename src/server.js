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
import { determineWidgetType } from './lib/determine-widget-type'

import Widget from './Widget/Widget'

import { loadWidgetData as loadGlobalMapData } from './Widget/GlobalMap/loadWidgetData.js'
import { loadWidgetData as loadDonutData } from './Widget/Donut/loadWidgetData.js'
import { loadWidgetData as loadBarData } from './Widget/Bar/loadWidgetData.js'
import { loadWidgetData as loadLineData } from './Widget/Line/loadWidgetData.js'
import { loadWidgetData as loadStaticCountrySidebarData } from './Widget/StaticCountrySidebar/loadWidgetData.js'

/// import i18n service to initialize it
import { i18n } from './server-only/locale-service.js'
import { mapNestedObjectToPathKeyedObject } from './util/mapNestedObjectToPathKeyedObject'

import tableTypeToTableWidgetMap from './Widget/StaticTable/table-type-to-table-widget-map.js'
import { API_URL } from './config'

const dataPreLoaders = {
  GlobalMap: loadGlobalMapData,
  StaticTable: (widget) => {
    // the functions for each static table widgets takes a "widgetParams" object made up
    // of many things, including a prepared 't' trnnslate function. It doesn't serve a purpose
    // on backend for now, so while we may wnnt to pass in a real function later, for now
    // just create a mocked one
    const widgetParams = {
      ...widget,
      t: () => '',
    }
    return tableTypeToTableWidgetMap[widget.tableType](
      widgetParams
    ).loadWidgetData(widget)
  },
  Donut: loadDonutData,
  Bar: loadBarData,
  Column: loadBarData,
  Line: loadLineData,
  StaticCountrySidebar: loadStaticCountrySidebarData,
}

const server = express()

server.use(cors())

const dataCache = {}

server
  .disable('x-powered-by')
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  .get('/render-widgets', async (req, res) => {
    const rawQueue = JSON.parse(req.query.queue)
    const enrichWidget = async (widget) => {
      const widgetType = await determineWidgetType(widget)
      const enriched = { ...widget, ...widgetType }
      return enriched
    }
    const enrichedQueue = await Promise.all(rawQueue.map(enrichWidget))
    // TODO: replace this with a Promise.all() method to load all data in parallel
    for (let i = 0; i < enrichedQueue.length; i++) {
      const widget = enrichedQueue[i]
      const dataLoader = dataPreLoaders[widget.type]
      if (dataLoader) {
        // Uncomment to restore the password-based data embargo mechanism. Remember that
        // we last time we turned off the in-memory caching of data, we didn't find a way
        // to combine it with the password authentication mechanism.
        // widget.nrcstatpassword = req.headers.nrcstatpassword
        // const data = await dataLoader(widget, {
        //   nrcstatpassword: req.headers.nrcstatpassword,
        // })
        // widget.preloadedWidgetData = data

        // Special case: if the widget ID is widget-wizard, it comes from the old
        // widget wizard or the new widget builder. Either way, there is no point
        // in caching data for these as they're not saved widgets.
        if (dataCache[widget.widgetId] && widget.widgetId !== 'widget-wizard') {
          widget.preloadedWidgetData = dataCache[widget.widgetId]
        } else {
          const data = await dataLoader(widget)
          widget.preloadedWidgetData = data
          dataCache[widget.widgetId] = data
        }
      }
    }

    const extractor = new ChunkExtractor({
      statsFile: pathLib.resolve('build/loadable-stats.json'),
      entrypoints: ['client'],
    })

    renderToString(
      <ChunkExtractorManager extractor={extractor}>
        {enrichedQueue.map((props) => (
          <Widget key={props.widgetId} {...props} />
        ))}
      </ChunkExtractorManager>
    )

    const languageLocaleData = mapValues(
      i18n.getDataByLanguage(enrichedQueue[0].locale),
      (namespace) => mapNestedObjectToPathKeyedObject(namespace)
    )

    const payload = {
      localeTranslation: {
        [enrichedQueue[0].locale]: languageLocaleData,
        ...languageLocaleData,
      },
      __LOADABLE_REQUIRED_CHUNKS__: null,
      widgetQueue: enrichedQueue,
      scripts: [],
      links: [],
    }

    const js = extractor.getScriptTags((attrs) => {
      if (attrs) {
        const scriptUrl = attrs.url
        payload.scripts.push({
          'data-chunk': attrs.chunk,
          src: scriptUrl,
        })
      }
      return attrs || {}
    })
    payload.__LOADABLE_REQUIRED_CHUNKS__ = JSON.parse(
      /<script.+>(.+)<\/script>/g.exec(js)[1]
    )

    const css = extractor.getStyleTags((attrs) => {
      if (attrs) {
        const linkUrl = attrs.url
        payload.links.push(linkUrl)
      }
      return attrs || {}
    })

    res.type('javascript').send(payload)
  })

export default server
