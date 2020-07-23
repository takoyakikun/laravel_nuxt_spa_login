import { shallowMount } from "@vue/test-utils"
import Vuetify from "vuetify"
import Vuex from "vuex"
import storeConfig from "@/test/storeConfig"
import TopScroll from "@/components/topScroll/topScroll.vue"

let store = new Vuex.Store(storeConfig)
let vuetify = new Vuetify()

describe("components/topScroll", () => {
  describe("topScroll", () => {
    const topScroll = jest.spyOn(TopScroll.methods, "topScroll")
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

    test("トップスクロールボタンを押してトップへスクロールする", () => {
      // トップスクロールボタンをクリック
      wrapper.find("#topScrollButton").vm.$emit("click")

      // topScroll メソッドが実行されたか
      expect(topScroll).toHaveBeenCalled()
    })

    test("destroy時のremoveEventListener動作", () => {
      const removeEventListener = jest.spyOn(window, "removeEventListener")

      // destroyする
      wrapper.destroy()

      // window.removeEventListener が実行されたか
      expect(removeEventListener).toHaveBeenCalled()
    })
  })
})
