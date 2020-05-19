(() => {
  const queue = []
  let loadQueued = false
  window.NrcStatWidgetLibrary = {
    generateWidget: params => {
      queue.push(params)
      if (!loadQueued) {
        setTimeout(loadAssets)
        loadQueued = true
      }
    }
  }
  const loadAssets = () => {
    
    const queueSerialized = encodeURIComponent(JSON.stringify(queue))
    const assetsPath = `/render-widgets?queue=${queueSerialized}`

    fetch(assetsPath)
      .then(resp => resp.json())
      .then(data => {
        window.nrcStatDrawWidgetQueue = data.widgetQueue
        const loadableInfoScriptEl = document.createElement('script')
        loadableInfoScriptEl.id = '__LOADABLE_REQUIRED_CHUNKS__'
        loadableInfoScriptEl.type = 'application/json'
        loadableInfoScriptEl.appendChild(document.createTextNode(JSON.stringify(data.__LOADABLE_REQUIRED_CHUNKS__)))
        document.querySelector('body').appendChild(loadableInfoScriptEl)
        data.scripts.forEach(script => {
          const scriptEl = document.createElement('script')
          scriptEl.src = script.src
          scriptEl['dataChunk'] = script['data-chunk']
          scriptEl.async = true
          document.querySelector('body').appendChild(scriptEl)
        })
        
      })

    /*
    // TODO: Check proper loader libraries for better techniques here
    const scriptElement = document.createElement('script')
    scriptElement.src = jsPath
    */

    /*
    const linkElement = document.createElement('link')
    linkElement.href = cssPath
    linkElement.rel = 'stylesheet'
    linkElement.type = 'text/css'
    */

    //document.querySelector('body').appendChild(scriptElement)
    //document.querySelector('body').appendChild(linkElement)
  }
})()
