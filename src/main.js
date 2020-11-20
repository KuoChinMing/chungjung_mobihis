import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import "roboto-fontface/css/roboto/roboto-fontface.css";
import "@mdi/font/css/materialdesignicons.css";
import { i18n } from "./i18n";
import { translation } from "./plugins/translation.js";

Vue.config.productionTip = false;
Vue.prototype.$i18nRoute = translation.i18nRoute;

new Vue({
  router,
  store,
  vuetify,
  i18n,
  render: h => h(App)
}).$mount("#app");
