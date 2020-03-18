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
  modules: ["@nuxtjs/axios", "@nuxtjs/proxy", "nuxt-basic-auth-module"],
  axios: {
    browserBaseURL: process.env.BROWSER_BASE_URL || null,
    headers: {
      get: {
        Authorization:
          "Basic " +
          Buffer.from(
            process.env.BASIC_AUTH_USER + ":" + process.env.BASIC_AUTH_PASS
          ).toString("base64")
      }
    },
    proxy: process.env.BROWSER_BASE_URL !== ""
  },
  proxy: {
    "/api/": {
      target: process.env.ES_URL || "http://db:9200",
      pathRewrite: {
        "^/api/": "/"
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
  basic: {
    name: process.env.BASIC_AUTH_USER || "media",
    pass: process.env.BASIC_AUTH_PASS || "pass",
    enabled: process.env.BASIC_ENABLED === "true"
  },
  srcDir: "./src/",
  watch: ["@/util/*.js"],
  server: {
    host: process.env.NUXT_HOST || "0.0.0.0",
    port: process.env.NUXT_PORT || 8080
  }
}
