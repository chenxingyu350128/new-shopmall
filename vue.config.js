
module.exports = {
  publicPath: './',
  // // assetsDir: './',//相对outputDir
  // 相对outputDir
  // assetsDir: './',
  filenameHashing: false,
  // transpileDependencies: ['vuetify'],

  // 相对outputDir
  indexPath: 'index.html',
  lintOnSave: false,
  productionSourceMap: false,
  // chainWebpack: config => {
  //   if (process.env.use_analyzer) {
  //     config
  //       .plugin('webpack-bundle-analyzer')
  //       .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
  //   }
  // }
  configureWebpack: {
    // externals:{
    //   vue: 'Vue',
    //   vuetify: 'Vuetify',
    //   'chart.js': 'Chart',
    //   vuex: 'Vuex',
    //   mockjs: 'Mock',
    //   'vue-router': 'VueRouter',
    //   lodash: '_'
    // }
  }
  // devServer: {
  //   proxy: {
  //     '/api': {
  //       target: 'http://192.168.1.101:8080/mall',
  //       ws: true,
  //       changeOrigin: true,
  //       pathRewrite: {
  //         '^/api': ''
  //       }
  //     }
  //   }
  // }
}
