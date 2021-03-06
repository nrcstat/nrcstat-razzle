(() => {
  const queue = []
  let loadQueued = false
  window.NrcStatWidgetLibrary = {
    getInstance: () => ({
      generateWidget: params => {
        queue.push(params)
        if (!loadQueued) {
          setTimeout(loadAssets)
          loadQueued = true
        }
      }
    })
  }
  const loadAssets = () => {
    const queueSerialized = encodeURIComponent(JSON.stringify(queue))
    const assetsPath = `/render-widgets?queue=${queueSerialized}`

    fetch(assetsPath)
      .then(resp => resp.json())
      .then(data => {
        window.localeTranslation = data.localeTranslation
        window.nrcStatDrawWidgetQueue = data.widgetQueue

        const loadableInfoScriptEl = document.createElement('script')
        loadableInfoScriptEl.id = '__LOADABLE_REQUIRED_CHUNKS__'
        loadableInfoScriptEl.type = 'application/json'
        loadableInfoScriptEl.appendChild(document.createTextNode(JSON.stringify(data.__LOADABLE_REQUIRED_CHUNKS__)))
        document.querySelector('body').appendChild(loadableInfoScriptEl)
        data.scripts.forEach(script => {
          const scriptEl = document.createElement('script')
          scriptEl.src = script.src
          scriptEl.dataChunk = script['data-chunk']
          scriptEl.async = true
          document.querySelector('body').appendChild(scriptEl)
        })

        data.links.forEach(link => {
          const linkEl = document.createElement('link')
          linkEl.href = link
          linkEl.rel = 'stylesheet'
          document.querySelector('body').appendChild(linkEl)
        })
      })
  }
})()
