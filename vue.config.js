const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  configureWebpack: {
    plugins: [
      new MonacoWebpackPlugin()
    ]
  },
  pages: {
    index: {
      entry: './src/main.js',
      template: './public/index.html',
      title: 'ETestDev',
    },
    worker: {
      entry: './src/worker/worker.js',
      template: './public/worker.html',
      title: 'ETestDev Worker',
    }
  }
}