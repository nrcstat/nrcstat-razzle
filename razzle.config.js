/* eslint-disable prefer-object-spread */
const path = require('path')
const LoadableWebpackPlugin = require('@loadable/webpack-plugin')
const LoadableBabelPlugin = require('@loadable/babel-plugin')
const babelPresetRazzle = require('razzle/babel')

module.exports = {
  modify: (config, { dev, target }) => {
    const appConfig = Object.assign({}, config)
    appConfig.resolve = appConfig.resolve || {}
    appConfig.resolve.alias = appConfig.resolve.alias || {}
    appConfig.resolve.alias['@'] = path.resolve(__dirname, 'src')

    console.log('********************************')
    console.log(target)
    console.log('********************************')

    if (target === 'web') {
      const filename = path.resolve(__dirname, 'build')

      appConfig.plugins = [
        ...appConfig.plugins,
        new LoadableWebpackPlugin({
          outputAsset: false,
          writeToDisk: { filename }
        })
      ]

      appConfig.output.filename = dev
        ? 'static/js/[name].js'
        : 'static/js/[name].[chunkhash:8].js'

      appConfig.node = { fs: 'empty' } // fix "Cannot find module 'fs'" problem. bugfix fix chore feat feature fixes

      appConfig.optimization = Object.assign({}, appConfig.optimization, {
        runtimeChunk: true,
        splitChunks: {
          chunks: 'all',
          name: dev
        }
      })
    }

    console.log(JSON.stringify(appConfig))

    // Applying this to be able to attach the VsCode debugger to the server process.
    // Tip sourced from:https://github.com/jaredpalmer/razzle/issues/546
    config.devtool = dev ? 'eval-source-map' : 'none'

    return appConfig
  },

  modifyBabelOptions: () => ({
    babelrc: false,
    presets: [babelPresetRazzle],
    plugins: [LoadableBabelPlugin]
  }),

  plugins: ['scss']
}
