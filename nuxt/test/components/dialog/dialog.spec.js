import { shallowMount } from "@vue/test-utils"
import Vuetify from "vuetify"
import Vuex from "vuex"
import storeConfig from "@/test/storeConfig"
import MyDialog from "@/components/dialog/myDialog"

let store = new Vuex.Store(storeConfig)
let vuetify = new Vuetify()

describe("components/dialog", () => {
  describe("myDialog", () => {
    let wrapper
    beforeEach(() => {
      wrapper = shallowMount(MyDialog, { store, vuetify })
    })

    test("is a Vue instance", () => {
      expect(wrapper.vm).toBeTruthy()
    })

    test("ダイアログの開閉(nameなし)", () => {
      // 初期状態は非表示
      expect(wrapper.vm.dialog).toBeFalsy()

      // ダイアログを開く
      wrapper.setProps({ value: true })
      expect(wrapper.vm.dialog).toBeTruthy()

      // ダイアログを閉じる
      wrapper.vm.close()
      expect(wrapper.emitted().input[0][0]).toBeFalsy()
    })

    test("ダイアログの開閉(nameあり)", () => {
      wrapper.setProps({ name: "test" })

      // 初期状態は非表示
      expect(wrapper.vm.dialog).toBeFalsy()

      // ダイアログを開く
      wrapper.vm.$store.dispatch("dialog/openDialog", "test")
      expect(wrapper.vm.dialog).toBeTruthy()

      // ダイアログを閉じる
      wrapper.vm.close()
      expect(wrapper.vm.dialog).toBeFalsy()
    })

    test("ダイアログの外をクリック", () => {
      const close = jest.spyOn(wrapper.vm, "close")

      // ダイアログを開く
      wrapper.setProps({ value: true })
      expect(wrapper.vm.dialog).toBeTruthy()

      // ダイアログの外をクリックしてもダイアログを閉じない設定
      wrapper.setProps({ options: { persistent: true } })

      // ダイアログの外をクリックしてダイアログを閉じる
      wrapper.vm.outside()

      // ダイアログを閉じる処理は実行されない
      expect(close).not.toHaveBeenCalled()
      close.mockReset()

      // ダイアログの外をクリックするとダイアログを閉じる設定
      wrapper.setProps({ options: { persistent: false } })

      // ダイアログの外をクリックしてダイアログを閉じる
      wrapper.vm.outside()

      // ダイアログを閉じる処理を実行したか
      expect(close).toHaveBeenCalled()
    })
  })
})
