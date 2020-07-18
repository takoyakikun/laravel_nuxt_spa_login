import { shallowMount } from "@vue/test-utils"
import Vuetify from "vuetify"
import Vuex from "vuex"
import storeConfig from "@/test/storeConfig"
import Snackbar from "@/components/snackbar/snackbar.vue"

let store = new Vuex.Store(storeConfig)
let vuetify = new Vuetify()

describe("components/snackbar", () => {
  describe("snackbar", () => {
    test("is a Vue instance", () => {
      const wrapper = shallowMount(Snackbar, { store, vuetify })
      expect(wrapper.vm).toBeTruthy()
    })

    test("snackbarを表示する", () => {
      const wrapper = shallowMount(Snackbar, { store, vuetify })
      wrapper.vm.$store.dispatch("snackbar/openSnackbar", {
        text: "テスト",
        options: { color: "success" }
      })
      const VSnackbar = wrapper.find("v-snackbar-stub")

      // snackbarが開いているか
      expect(VSnackbar.vm.value).toBeTruthy()

      // snackbarに指定したテキストが表示されているか
      expect(VSnackbar.vm.text).toBe("テスト")

      // snackbarが指定した色で表示されているか
      expect(VSnackbar.vm.options.color).toBe("success")
    })
  })
})
