warning: in the working copy of 'package-lock.json', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of 'package.json', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of 'vue.config.js', LF will be replaced by CRLF the next time Git touches it
[1mdiff --git a/package-lock.json b/package-lock.json[m
[1mindex daa5f6d..4911b77 100644[m
[1m--- a/package-lock.json[m
[1m+++ b/package-lock.json[m
[36m@@ -21,7 +21,8 @@[m
         "@vue/cli-plugin-eslint": "~5.0.0",[m
         "@vue/cli-service": "~5.0.0",[m
         "eslint": "^7.32.0",[m
[31m-        "eslint-plugin-vue": "^8.0.3"[m
[32m+[m[32m        "eslint-plugin-vue": "^8.0.3",[m
[32m+[m[32m        "webpack-bundle-analyzer": "^4.10.2"[m
       }[m
     },[m
     "node_modules/@achrinza/node-ipc": {[m
[1mdiff --git a/package.json b/package.json[m
[1mindex 9c8c8fe..5a59074 100644[m
[1m--- a/package.json[m
[1m+++ b/package.json[m
[36m@@ -5,7 +5,9 @@[m
   "scripts": {[m
     "serve": "vue-cli-service serve",[m
     "build": "vue-cli-service build",[m
[31m-    "lint": "vue-cli-service lint"[m
[32m+[m[32m    "lint": "vue-cli-service lint",[m
[32m+[m[32m    "analyze": "vue-cli-service build --mode production --report"[m
[32m+[m[32m}[m
   },[m
   "dependencies": {[m
     "@fortawesome/fontawesome-free": "^6.7.2",[m
[36m@@ -21,7 +23,8 @@[m
     "@vue/cli-plugin-eslint": "~5.0.0",[m
     "@vue/cli-service": "~5.0.0",[m
     "eslint": "^7.32.0",[m
[31m-    "eslint-plugin-vue": "^8.0.3"[m
[32m+[m[32m    "eslint-plugin-vue": "^8.0.3",[m
[32m+[m[32m    "webpack-bundle-analyzer": "^4.10.2"[m
   },[m
   "eslintConfig": {[m
     "root": true,[m
[1mdiff --git a/vue.config.js b/vue.config.js[m
[1mindex 910e297..2e29ccd 100644[m
[1m--- a/vue.config.js[m
[1m+++ b/vue.config.js[m
[36m@@ -1,4 +1,75 @@[m
 const { defineConfig } = require('@vue/cli-service')[m
[32m+[m[32mconst BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin[m
[32m+[m
 module.exports = defineConfig({[m
[31m-  transpileDependencies: true[m
[31m-})[m
[32m+[m[32m  // 1. Configurações básicas de produção[m
[32m+[m[32m  productionSourceMap: false, // Desativa source maps em produção[m
[32m+[m[32m  filenameHashing: true, // Hashing nos nomes de arquivos para cache[m
[32m+[m
[32m+[m[32m  // 2. Otimizações de build[m
[32m+[m[32m  chainWebpack: (config) => {[m
[32m+[m[32m    // 2.1 Configuração avançada de code splitting[m
[32m+[m[32m    config.optimization.splitChunks({[m
[32m+[m[32m      chunks: 'all',[m
[32m+[m[32m      maxSize: 244 * 1024, // 244KB (tamanho ideal para HTTP/2)[m
[32m+[m[32m      cacheGroups: {[m
[32m+[m[32m        vendors: {[m
[32m+[m[32m          name: 'chunk-vendors',[m
[32m+[m[32m          test: /[\\/]node_modules[\\/]/,[m
[32m+[m[32m          priority: -10,[m
[32m+[m[32m          chunks: 'initial'[m
[32m+[m[32m        },[m
[32m+[m[32m        common: {[m
[32m+[m[32m          name: 'chunk-common',[m
[32m+[m[32m          minChunks: 2,[m
[32m+[m[32m          priority: -20,[m
[32m+[m[32m          reuseExistingChunk: true[m
[32m+[m[32m        }[m
[32m+[m[32m      }[m
[32m+[m[32m    })[m
[32m+[m
[32m+[m[32m    // 2.2 Preload de recursos críticos[m
[32m+[m[32m    config.plugin('preload').tap((options) => {[m
[32m+[m[32m      options[0] = {[m
[32m+[m[32m        rel: 'preload',[m
[32m+[m[32m        include: 'allAssets',[m
[32m+[m[32m        fileBlacklist: [/\.map$/, /hot-update\.js$/][m
[32m+[m[32m      }[m
[32m+[m[32m      return options[m
[32m+[m[32m    })[m
[32m+[m
[32m+[m[32m    // 2.3 Remove prefetch para melhor controle[m
[32m+[m[32m    config.plugins.delete('prefetch')[m
[32m+[m[32m  },[m
[32m+[m
[32m+[m[32m  // 3. Configurações de performance[m
[32m+[m[32m  configureWebpack: {[m
[32m+[m[32m    plugins: [[m
[32m+[m[32m      // 3.1 Analisador de bundle (executar com --report)[m
[32m+[m[32m      new BundleAnalyzerPlugin({[m
[32m+[m[32m        analyzerMode: process.env.NODE_ENV === 'production' ? 'disabled' : 'static',[m
[32m+[m[32m        reportFilename: '../bundle-report.html',[m
[32m+[m[32m        openAnalyzer: false[m
[32m+[m[32m      })[m
[32m+[m[32m    ],[m
[32m+[m[32m    performance: {[m
[32m+[m[32m      // 3.2 Limites de tamanho para assets[m
[32m+[m[32m      maxEntrypointSize: 512 * 1024, // 512KB[m
[32m+[m[32m      maxAssetSize: 512 * 1024 // 512KB[m
[32m+[m[32m    }[m
[32m+[m[32m  },[m
[32m+[m
[32m+[m[32m  // 4. Otimização de CSS[m
[32m+[m[32m  css: {[m
[32m+[m[32m    extract: {[m
[32m+[m[32m      ignoreOrder: true // Evita warnings de ordem CSS[m
[32m+[m[32m    },[m
[32m+[m[32m    loaderOptions: {[m
[32m+[m[32m      css: {[m
[32m+[m[32m        url: {[m
[32m+[m[32m          filter: (url) => !url.startsWith('/') // Otimiza URLs[m
[32m+[m[32m        }[m
[32m+[m[32m      }[m
[32m+[m[32m    }[m
[32m+[m[32m  }[m
[32m+[m[32m})[m
\ No newline at end of file[m
