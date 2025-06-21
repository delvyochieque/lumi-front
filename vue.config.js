const { defineConfig } = require('@vue/cli-service')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = defineConfig({
  // 1. Configurações básicas de produção
  productionSourceMap: false, // Desativa source maps em produção
  filenameHashing: true, // Hashing nos nomes de arquivos para cache

  // 2. Otimizações de build
  chainWebpack: (config) => {
    // 2.1 Configuração avançada de code splitting
    config.optimization.splitChunks({
      chunks: 'all',
      maxSize: 244 * 1024, // 244KB (tamanho ideal para HTTP/2)
      cacheGroups: {
        vendors: {
          name: 'chunk-vendors',
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          chunks: 'initial'
        },
        common: {
          name: 'chunk-common',
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    })

    // 2.2 Preload de recursos críticos
    config.plugin('preload').tap((options) => {
      options[0] = {
        rel: 'preload',
        include: 'allAssets',
        fileBlacklist: [/\.map$/, /hot-update\.js$/]
      }
      return options
    })

    // 2.3 Remove prefetch para melhor controle
    config.plugins.delete('prefetch')
  },

  // 3. Configurações de performance
  configureWebpack: {
    plugins: [
      // 3.1 Analisador de bundle (executar com --report)
      new BundleAnalyzerPlugin({
        analyzerMode: process.env.NODE_ENV === 'production' ? 'disabled' : 'static',
        reportFilename: '../bundle-report.html',
        openAnalyzer: false
      })
    ],
    performance: {
      // 3.2 Limites de tamanho para assets
      maxEntrypointSize: 512 * 1024, // 512KB
      maxAssetSize: 512 * 1024 // 512KB
    }
  },

  // 4. Otimização de CSS
  css: {
    extract: {
      ignoreOrder: true // Evita warnings de ordem CSS
    },
    loaderOptions: {
      css: {
        url: {
          filter: (url) => !url.startsWith('/') // Otimiza URLs
        }
      }
    }
  }
})