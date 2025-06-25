const { defineConfig } = require('@vue/cli-service')
const PreloadPlugin = require('@vue/preload-webpack-plugin')

module.exports = defineConfig({
  publicPath: '/', // Garante que assets são carregados de /
  productionSourceMap: false,
  filenameHashing: true,

  chainWebpack: config => {
    config.optimization.splitChunks({
      chunks: 'all',
      maxSize: 244 * 1024,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          chunks: 'initial'
        }
      }
    })

    config.plugin('preload')
      .use(PreloadPlugin, [{
        rel: 'preload',
        include: 'allAssets',
        fileBlacklist: [/\.map$/, /hot-update\.js$/]
      }])

    config.plugins.delete('prefetch')
  },

  css: {
    extract: true
  }
})