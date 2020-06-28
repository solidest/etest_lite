module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
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