module.exports = {
  runtimeCompiler: true,
  
  publicPath: process.env.NODE_ENV === "production" ? "./" : "/",

  pluginOptions: {
    i18n: {
      locale: "zh",
      fallbackLocale: "en",
      localeDir: "locales",
      enableInSFC: true
    }
  }
};
