import Vue from "vue"
import Vuetify from "vuetify"
import Vuex from "vuex"
import { ValidationProvider, ValidationObserver } from "vee-validate"
import registerRequireContextHook from "babel-plugin-require-context-hook/register"

Vue.use(Vuetify)
Vue.use(Vuex)
Vue.component("ValidationProvider", ValidationProvider)
Vue.component("ValidationObserver", ValidationObserver)

registerRequireContextHook()
