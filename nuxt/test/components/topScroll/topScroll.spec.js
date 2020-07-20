import { shallowMount } from "@vue/test-utils"
import Vuetify from "vuetify"
import Vuex from "vuex"
import storeConfig from "@/test/storeConfig"
import TopScroll from "@/components/topScroll/topScroll.vue"

let store = new Vuex.Store(storeConfig)
let vuetify = new Vuetify()

describe("components/topScroll", () => {
  describe("topScroll", () => {
    let wrapper
    beforeEach(() => {
      wrapper = shallowMount(TopScroll, { store, vuetify })
    })

    test("is a Vue instance", () => {
      expect(wrapper.vm).toBeTruthy()
    })

    test("トップスクロールボタンを表示する", () => {
      // 縦の位置が100px以下は表示しない
      window.scrollY = 100
      wrapper.vm.handleScroll()
      expect(wrapper.vm.showTopScroll).toBeFalsy()

      // 縦の位置が101px以上に変わると表示に切り替わる
      window.scrollY = 101
      wrapper.vm.handleScroll()
      expect(wrapper.vm.showTopScroll).toBeTruthy()

      // 縦の位置が100px以下に変わると非表示に切り替わる
      window.scrollY = 100
      wrapper.vm.handleScroll()
      expect(wrapper.vm.showTopScroll).toBeFalsy()
    })
  })
})
