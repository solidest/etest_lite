import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import etlua from './language/script_lua';
import etbin from './language/script_bin';
import ethex from './language/script_hex';
import complition from './language/complition.js';
import * as monaco from 'monaco-editor';

Vue.config.productionTip = false;

monaco.languages.register({id: 'etlua' });
monaco.languages.setMonarchTokensProvider('etlua', etlua.language);
monaco.languages.setLanguageConfiguration('etlua', etlua.conf);
monaco.languages.registerCompletionItemProvider('etlua', complition.provider);
monaco.languages.register({id: 'etbin'});
monaco.languages.setMonarchTokensProvider('etbin', etbin.language);
monaco.languages.register({id: 'ethex'});
monaco.languages.setMonarchTokensProvider('ethex', ethex.language);

monaco.languages.registerCodeActionProvider
new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
