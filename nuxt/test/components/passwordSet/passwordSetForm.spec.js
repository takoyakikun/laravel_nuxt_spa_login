import { createLocalVue, shallowMount } from "@vue/test-utils"
import Vuetify from "vuetify"
import Vuex from "vuex"
import storeConfig from "@/test/storeConfig"
import PasswordSetForm from "@/components/passwordSet/passwordSetForm"

const localVue = createLocalVue()
localVue.use(Vuex)

const store = new Vuex.Store(storeConfig)
const vuetify = new Vuetify()

jest.useFakeTimers()

afterEach(() => {
  jest.clearAllMocks()
})

describe("components/passwordSet/passwordSetForm", () => {
  describe("テスト", () => {
    let wrapper
    beforeEach(() => {
      wrapper = shallowMount(PasswordSetForm, {
        localVue,
        store,
        vuetify,
        sync: false
      })
    })

    test("is a Vue instance", () => {
      expect(wrapper.vm).toBeTruthy()
    })

    test("フォーム送信", () => {
      // キー入力イベント
      const event = {
        keyCode: 13
      }

      // フォーム送信
      wrapper.vm.submit(event)

      // submitがemitされている
      expect(wrapper.emitted().submit).toBeTruthy()
    })

    test("フォーム送信(enterキー以外)", () => {
      // キー入力イベント
      const event = {
        keyCode: 12
      }

      // フォーム送信
      wrapper.vm.submit(event)

      // submitがemitされない
      expect(wrapper.emitted().submit).toBeFalsy()
    })
  })
})