import { createLocalVue, shallowMount } from "@vue/test-utils"
import Vuetify from "vuetify"
import Vuex from "vuex"
import storeConfig from "@/test/storeConfig"
import setConfigData from "@/test/setConfigData"
import UserForm from "@/components/users/userForm"

const localVue = createLocalVue()
localVue.use(Vuex)

let vuetify = new Vuetify()

jest.useFakeTimers()

let store
beforeEach(() => {
  store = new Vuex.Store(storeConfig)
  store.commit("config/setConfig", setConfigData)
})

afterEach(() => {
  jest.clearAllMocks()
})

describe("components/users/userForm", () => {
  describe("shallowMount", () => {
    let wrapper
    beforeEach(async () => {
      wrapper = shallowMount(UserForm, {
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

    describe("権限ごとに選択できる権限を変える", () => {
      test("開発者権限", () => {
        // 権限を開発者にする
        wrapper.vm.$store.commit("auth/setPermission", {
          category: "system-only",
          permission: true
        })

        // 全ての権限を返す
        expect(wrapper.vm.role.map(item => item.value)).toEqual([1, 5, 10])
      })

      test("それ以外", () => {
        // 管理者以外を返す
        expect(wrapper.vm.role.map(item => item.value)).toEqual([5, 10])
      })
    })
  })
})
