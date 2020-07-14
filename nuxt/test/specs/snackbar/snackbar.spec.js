import { shallowMount, createLocalVue } from "@vue/test-utils"
import test from "ava"
import Vuetify from "vuetify"
import Vuex from "vuex"
import storeConfig from "@/test/store-config"
import { cloneDeep } from "lodash"
import Snackbar from "@/components/snackbar/snackbar.vue"

const localVue = createLocalVue()

localVue.use(Vuetify)
localVue.use(Vuex)

let store
let vuetify
test.before("ストアとvuetifyをセット", t => {
  store = new Vuex.Store(cloneDeep(storeConfig))
  vuetify = new Vuetify()
})

test("snackbarを表示する", t => {
  const wrapper = shallowMount(Snackbar, { localVue, store, vuetify })
  wrapper.vm.$store.dispatch("snackbar/openSnackbar", {
    text: "テスト",
    options: { color: "success" }
  })
  const VSnackbar = wrapper.find("v-snackbar-stub")

  // snackbarが開いているか
  t.true(VSnackbar.vm.value)

  // snackbarに指定したテキストが表示されているか
  t.is(VSnackbar.vm.text, "テスト")

  // snackbarが指定した色で表示されているか
  t.is(VSnackbar.vm.options.color, "success")
})
