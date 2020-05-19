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

      appConfig.module = {
        rules: [
          /* {
            test: /index.js$/,
            include: [
              path.resolve(__dirname, "node_modules", "d3-tip")
            ],
            use: 'imports-loader?this=>window'
          }, */
          {
            test: /datatables\.net.*/,
            use: 'imports-loader?define=>false'
          },
          {
            test: /\.(js)$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader'
            }
          },
          {
            test: /\.(s*)css$/,
            use: ['style-loader', 'css-loader', 'sass-loader']
          },
          {
            test: /\.(png|jp(e*)g|svg)$/,
            use: [{
              loader: 'url-loader',
              options: {
                limit: 8000, // Convert images < 8kb to base64 strings
                name: 'images/[hash]-[name].[ext]'
              }
            }]
          }
        ],
        noParse: /(mapbox-gl)\.js$/ // Added to prevent some kind of corruption of mapbox-gl, see this link for details
        // https://github.com/mapbox/mapbox-gl-js/issues/4359#issuecomment-288001933
      }

      appConfig.optimization = Object.assign({}, appConfig.optimization, {
        runtimeChunk: true,
        splitChunks: {
          chunks: 'all',
          name: dev
        }
      })
    }

    return appConfig
  },

  modifyBabelOptions: () => ({
    babelrc: false,
    presets: [babelPresetRazzle],
    plugins: [LoadableBabelPlugin]
  })
}
