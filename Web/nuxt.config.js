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
  // css: [
  //   "~/assets/css/style.css",
  // ],
  buildModules: ["@nuxtjs/eslint-module", "@nuxtjs/vuetify"],
  modules: ["@nuxtjs/axios"],
  axios: {
    baseURL: "http://db:9200",
    browserBaseURL: "http://localhost:9200"
  },
  vuetify: {
    // customVariables: ["~/assets/variables.scss"],
    theme: {
      themes: {
        light: {
          primary: colors.blue.darken2
        }
      }
    }
  },
  srcDir: "./src/",
  watch: ["~/util/*.js"]
}
