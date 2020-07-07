import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import etlua from './language/script_lua';
import * as monaco from 'monaco-editor';

Vue.config.productionTip = false;

monaco.languages.register({id: 'etlua' });
monaco.languages.setMonarchTokensProvider('etlua', etlua.language);
monaco.languages.setLanguageConfiguration('etlua', etlua.conf);

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
