import Vue from 'vue';
import App from './App.vue';
import router from './router';
import i18n from '@/plugins/i18n';
import '@/plugins/bootstrap';
import '@/plugins/clipboard2';
import '@/plugins/filters';
import '@/plugins/treeview';
import '@/plugins/json-viewer';
import '@/plugins/mermaid';
import '@/plugins/dragscroll';

Vue.config.productionTip = false;

new Vue({
  router,
  i18n,
  render: h => h(App)
}).$mount('#app');
