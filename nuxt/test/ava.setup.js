require("browser-env")()
const hooks = require("require-extension-hooks")
const Vue = require("vue")

const registerRequireContextHook = require("babel-plugin-require-context-hook/register")
registerRequireContextHook()

Vue.config.productionTip = false
Vue.config.devtools = false

// https://github.com/nuxt/create-nuxt-app/issues/180#issuecomment-463069941
window.Date = global.Date = Date

hooks("vue")
  .plugin("vue")
  .push()
hooks(["vue", "js"])
  .exclude(({ filename }) => filename.match(/\/node_modules\//))
  .plugin("babel")
  .push()
