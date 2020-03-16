import colors from "vuetify/es5/util/colors"

export default {
  mode: "universal",
  head: {
    titleTemplate: "%s - " + process.env.npm_package_name,
    title: process.env.npm_package_name || "",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: process.env.npm_package_description || ""
      }
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }]
  },
  loading: { color: "#fff" },
  buildModules: ["@nuxtjs/eslint-module", "@nuxtjs/vuetify"],
  modules: ["@nuxtjs/axios", "@nuxtjs/proxy"],
  axios: {
    browserBaseURL: "http://ext-host0004.ascade.co.jp:8888",
    headers: {
      common: {
        Authorization:
          "Basic " +
          Buffer.from(
            process.env.BASIC_AUTH_USER + ":" + process.env.BASIC_AUTH_PASS
          ).toString("base64")
      }
    }
  },
  proxy: {
    "/api": {
      target: "http://db:9200",
      pathRewrite: {
        "^/api": ""
      }
    }
  },
  vuetify: {
    theme: {
      themes: {
        light: {
          primary: colors.blue.darken2
        }
      }
    }
  },
  srcDir: "./src/",
  watch: ["@/util/*.js"]
}
