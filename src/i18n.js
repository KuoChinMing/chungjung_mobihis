import Vue from "vue";
import VueI18n from "vue-i18n";
import zh from "@/locales/zh.json";

Vue.use(VueI18n);

// function loadLocaleMessages() {
//   const locales = require.context(
//     "./locales",
//     true,
//     /[A-Za-z0-9-_,\s]+\.json$/i
//   );
//   const messages = {};
//   locales.keys().forEach(key => {
//     const matched = key.match(/([A-Za-z0-9-_]+)\./i);
//     if (matched && matched.length > 1) {
//       const locale = matched[1];
//       messages[locale] = locales(key);
//     }
//   });
//   return messages;
// }

export const i18n = new VueI18n({
  locale: process.env.VUE_APP_LOCALE || "en",
  fallbackLocale: process.env.VUE_APP_FALLBACK_LOCALE || "en",
  // messages: loadLocaleMessages()
  messages: { zh }
});
