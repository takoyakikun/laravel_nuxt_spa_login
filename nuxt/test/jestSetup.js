import Vue from "vue"
import Vuetify from "vuetify"
import Vuex from "vuex"
import {
  ValidationProvider,
  ValidationObserver,
  localize,
  extend
} from "vee-validate"
import ja from "vee-validate/dist/locale/ja.json" // エラーメッセージの日本語化用
import * as rules from "vee-validate/dist/rules" // 全てのバリデーションルール
import registerRequireContextHook from "babel-plugin-require-context-hook/register"

Vue.use(Vuetify)
const app = document.createElement("div")
app.setAttribute("data-app", true)
document.body.append(app)

Vue.use(Vuex)

// forループで全てのバリデーションルールをextendで登録する
for (const rule in rules) {
  extend(rule, rules[rule])
}

Vue.component("ValidationProvider", ValidationProvider)
Vue.component("ValidationObserver", ValidationObserver)
localize("ja", ja)

registerRequireContextHook()
