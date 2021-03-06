import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from '@/router'
import vuetify from '@/plugins/vuetify'
import axios from 'axios'
import '@/styles/global.css'

Vue.prototype.axios = axios
Vue.prototype.router = router

Vue.config.productionTip = false

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
