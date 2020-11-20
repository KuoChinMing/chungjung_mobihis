import { i18n } from "@/i18n.js";
import vuetify from "@/plugins/vuetify.js";
import axios from "axios";

const translation = {
  get defaultLocale() {
    return process.env.VUE_APP_LOCALE;
  },
  get supportedLocales() {
    return process.env.VUE_APP_SUPPORTED_LOCALE.split(",");
  },
  get currentLocale() {
    return i18n.locale;
  },
  set currentLocale(locale) {
    i18n.locale = locale;
  },
  isLocaleSupported(locale) {
    return translation.supportedLocales.includes(locale);
  },
  loadLocaleFile(locale) {
    return import(`@/locales/${locale}.json`);
  },
  changeLocale(locale) {
    if (!translation.isLocaleSupported(locale))
      return Promise.reject(new Error("Locale not supported"));
    if (i18n.locale === locale) return Promise.resolve(locale);

    return translation.loadLocaleFile(locale).then(msgs => {
      i18n.setLocaleMessage(locale, msgs.default || msgs);
      return translation.setI18nLocaleInServices(locale);
    });
  },
  setI18nLocaleInServices(locale) {
    translation.currentLocale = locale;
    vuetify.framework.lang.current = locale;
    axios.defaults.headers.common["Accept-Language"] = locale;
    document.querySelector("html").setAttribute("lang", locale);
    return locale;
  },
  routeMiddleware(to, from, next) {
    const locale = to.params.locale;
    if (!translation.isLocaleSupported(locale)) return next(translation.getUserSupportedLocale());
    return translation.changeLocale(locale).then(() => next());
  },
  i18nRoute(to) {
    return {
      ...to,
      params: { ...to.params, locale: translation.currentLocale }
    };
  },
  getUserLocale() {
    const locale =
      window.navigator.language || window.navigator.userLanguage || translation.defaultLocale;
    return {
      locale: locale,
      localeNoISO: locale.split("-")[0]
    };
  },
  getUserSupportedLocale() {
    const userPreferredLocale = translation.getUserLocale();
    if (translation.isLocaleSupported(userPreferredLocale.locale)) {
      return userPreferredLocale.locale;
    }
    if (translation.isLocaleSupported(userPreferredLocale.localeNoISO)) {
      return userPreferredLocale.localeNoISO;
    }
    return translation.defaultlocale;
  }
};

export { translation };
