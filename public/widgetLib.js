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
    const jsPath = `/render-widgets/js?queue=${queueSerialized}`
    const cssPath = `/render-widgets/css?queue=${queueSerialized}`

    // TODO: Check proper loader libraries for better techniques here
    const scriptElement = document.createElement('script')
    scriptElement.src = jsPath

    /*
    const linkElement = document.createElement('link')
    linkElement.href = cssPath
    linkElement.rel = 'stylesheet'
    linkElement.type = 'text/css'
    */

    document.querySelector('body').appendChild(scriptElement)
    //document.querySelector('body').appendChild(linkElement)
  }
})()
