import { shallowMount, createLocalVue } from "@vue/test-utils"
import test from "ava"
import Vuetify from "vuetify"
import Vuex from "vuex"
import storeConfig from "@/test/store-config"
import { cloneDeep } from "lodash"
import { ValidationProvider, ValidationObserver } from "vee-validate"
import Header from "@/components/layouts/default/header.vue"

const localVue = createLocalVue()

localVue.use(Vuetify)
localVue.use(Vuex)
localVue.component("ValidationProvider", ValidationProvider)
localVue.component("ValidationObserver", ValidationObserver)

let store
let vuetify
test.before("ストアとvuetifyをセット", t => {
  store = new Vuex.Store(cloneDeep(storeConfig))
  vuetify = new Vuetify()
})

test("ユーザー編集ダイアログを開く", t => {
  store.state.auth.user = {
    name: "テスト"
  }
  const wrapper = shallowMount(Header, { localVue, store, vuetify })
  wrapper.find("#openEditDialog").vm.$emit("click")

  t.true(wrapper.vm.editDialog)
})

test("パスワード変更ダイアログを開く", t => {
  store.state.auth.user = {
    name: "テスト"
  }
  const wrapper = shallowMount(Header, { localVue, store, vuetify })
  wrapper.find("#openPasswordChangeDialog").vm.$emit("click")

  t.true(wrapper.vm.passwordChangeDialog)
})
