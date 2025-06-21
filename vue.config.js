const { defineConfig } = require('@vue/cli-service')
const PreloadPlugin = require('@vue/preload-webpack-plugin')

module.exports = defineConfig({
  // Configurações básicas
  productionSourceMap: false,
  filenameHashing: true,

  // Configurações de otimização
  chainWebpack: config => {
    // 1. Configuração de code splitting
    config.optimization.splitChunks({
      chunks: 'all',
      maxSize: 244 * 1024, // 244KB
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          chunks: 'initial'
        }
      }
    })

    // 2. Configuração do plugin preload (CORRIGIDO)
    config.plugin('preload')
      .use(PreloadPlugin, [{
        rel: 'preload',
        include: 'allAssets',
        fileBlacklist: [/\.map$/, /hot-update\.js$/]
      }])

    // 3. Remove prefetch padrão
    config.plugins.delete('prefetch')
  },

  // Outras configurações
  css: {
    extract: true
  }
})