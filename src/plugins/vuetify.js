import Vue from "vue";
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";
import zhHant from "vuetify/es5/locale/zh-Hant";

Vue.use(Vuetify);

export default new Vuetify({
  lang: {
    locales: { zhHant },
    current: "zhHant"
  },
  theme: {
    themes: {
      light: {
        primary: "#00b0ec" // ebm blue
        // primary: "#ee44aa",
        // secondary: "#424242",
        // accent: "#82B1FF",
        // error: "#FF5252",
        // info: "#2196F3",
        // success: "#4CAF50",
        // warning: "#FFC107"
      }
    }
  }
});
