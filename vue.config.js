module.exports = {
  chainWebpack: config => config.resolve.symlinks(false),
  pluginOptions: {
    i18n: {
      locale: "en",
      fallbackLocale: "en",
      localeDir: "locales",
      enableInSFC: false
    }
  }
  // https://medium.com/js-dojo/how-to-deal-with-cors-error-on-vue-cli-3-d78c024ce8d3
  // https://masteringjs.io/tutorials/vue/config
  // https://stackoverflow.com/questions/40863417/cors-issue-with-vue-js
  // "https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?id=4660&convert=USD&CMC_PRO_API_KEY=902e192a-d57a-49ac-986d-01b5f3a1b922"
  // devServer: {proxy: "https://pro-api.coinmarketcap.com/v1/cryptocurrency/"}
};
