import { shallowMount } from "@vue/test-utils"
import Vuetify from "vuetify"
import Vuex from "vuex"
import storeConfig from "@/test/storeConfig"
import Header from "~/components/layouts/default/header"
import Footer from "~/components/layouts/default/footer"
import SideBar from "~/components/layouts/default/SideBar"

let store = new Vuex.Store(storeConfig)
let vuetify = new Vuetify()

describe("components/layouts/default", () => {
  describe("header", () => {
    test("is a Vue instance", () => {
      const wrapper = shallowMount(Header, { store, vuetify })
      expect(wrapper.vm).toBeTruthy()
    })

    test("ユーザー編集ダイアログを開く", () => {
      store.state.auth.user = {
        name: "テスト"
      }
      const wrapper = shallowMount(Header, { store, vuetify })
      wrapper.find("#openEditDialog").vm.$emit("click")

      // ユーザー編集ダイアログが開いているか
      expect(wrapper.vm.editDialog).toBeTruthy()
    })

    test("パスワード変更ダイアログを開く", () => {
      store.state.auth.user = {
        name: "テスト"
      }
      const wrapper = shallowMount(Header, { store, vuetify })
      wrapper.find("#openPasswordChangeDialog").vm.$emit("click")

      // パスワード変更ダイアログが開いているか
      expect(wrapper.vm.passwordChangeDialog).toBeTruthy()
    })
  })

  describe("footer", () => {
    test("is a Vue instance", () => {
      const wrapper = shallowMount(Footer, { store, vuetify })
      expect(wrapper.vm).toBeTruthy()
    })
  })

  describe("sideBar", () => {
    test("is a Vue instance", () => {
      const wrapper = shallowMount(SideBar, { store, vuetify })
      expect(wrapper.vm).toBeTruthy()
    })
  })
})
