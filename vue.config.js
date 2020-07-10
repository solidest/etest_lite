const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const MonacoLocalesPlugin = require('monaco-editor-locales-plugin');
module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  configureWebpack: {
    plugins: [
      new MonacoWebpackPlugin(),
      new MonacoLocalesPlugin({
        languages: ["es", "zh-cn"],
        defaultLanguage: "zh-cn",
        logUnmatched: false,
        mapLanguages: {
          "zh-cn": {
            "Peek References": "查找引用",
            "Go to Symbol...": "跳到变量位置",
            "Command Palette": "命令面板"
          }
        }
      })
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
    },
    player: {
      entry: './src/player/player.js',
      template: './public/player.html',
      title: 'ETestDev Player',
    }
  }
}