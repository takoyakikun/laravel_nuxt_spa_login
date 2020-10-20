import { createLocalVue, shallowMount } from "@vue/test-utils"
import Vuetify from "vuetify"
import Vuex from "vuex"
import storeConfig from "@/test/storeConfig"
import setConfigData from "@/test/setConfigData"
import UserForm from "@/components/users/userForm"
import Form from "@/components/form/form"

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
  describe("テスト", () => {
    let wrapper
    beforeEach(async () => {
      wrapper = shallowMount(UserForm, {
        localVue,
        store,
        vuetify,
        sync: false,
        stubs: {
          Form
        }
      })
    })

    test("is a Vue instance", () => {
      expect(wrapper.vm).toBeTruthy()
    })

    describe("権限ごとに選択できる権限を変える", () => {
      test("開発者権限", () => {
        // 選択オプションデータをセット
        wrapper.vm.$store.commit("users/setRoleOptions", [1, 2, 3])

        // 全ての権限を返す
        expect(wrapper.vm.role.map(item => item.value)).toEqual([1, 2, 3])
      })

      test("それ以外", () => {
        // 選択オプションデータをセット
        wrapper.vm.$store.commit("users/setRoleOptions", [2, 3])

        // 管理者以外を返す
        expect(wrapper.vm.role.map(item => item.value)).toEqual([2, 3])
      })
    })
  })
})
