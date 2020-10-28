import { createLocalVue, shallowMount, mount } from "@vue/test-utils"
import Vuetify from "vuetify"
import Vuex from "vuex"
import storeConfig from "@/test/storeConfig"
import setConfigData from "@/test/setConfigData"
import PasswordChangeForm from "@/components/users/passwordChangeForm"
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

describe("components/users/passwordChangeForm", () => {
  describe("テスト", () => {
    let wrapper
    beforeEach(async () => {
      wrapper = shallowMount(PasswordChangeForm, {
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
  })

  describe("フォームバリデーションテスト", () => {
    let wrapper
    beforeEach(() => {
      wrapper = mount(PasswordChangeForm, {
        localVue,
        store,
        vuetify,
        sync: false
      })
    })

    test("現在のパスワード", async () => {
      const form = wrapper.find("input[name='current_password']")
      const validation = wrapper.vm.$refs.currentPasswordValidation

      // required
      form.setValue("")
      await validation.validate()
      expect(validation.failedRules.required).toBeTruthy()

      // min
      form.setValue("a".repeat(7))
      await validation.validate()
      expect(validation.failedRules.min).toBeTruthy()

      // valid
      form.setValue("password")
      await validation.validate()
      expect(Object.keys(validation.failedRules).length).toBe(0)
    })

    test("変更後のパスワード", async () => {
      const form = wrapper.find("input[name='password']")
      const validation = wrapper.vm.$refs.passwordValidation

      // required
      form.setValue("")
      await validation.validate()
      expect(validation.failedRules.required).toBeTruthy()

      // min
      form.setValue("a".repeat(7))
      await validation.validate()
      expect(validation.failedRules.min).toBeTruthy()

      // valid
      form.setValue("password")
      await validation.validate()
      expect(Object.keys(validation.failedRules).length).toBe(0)
    })

    test("変更後のパスワード(確認)", async () => {
      const form = wrapper.find("input[name='password_confirmation']")
      const passwordForm = wrapper.find("input[name='password']")
      const validation = wrapper.vm.$refs.passwordConfirmationValidation
      const passwordValidation = wrapper.vm.$refs.passwordValidation

      // required
      form.setValue("")
      passwordForm.setValue("password")
      await validation.validate()
      await passwordValidation.validate()
      expect(validation.failedRules.required).toBeTruthy()

      // min
      form.setValue("a".repeat(7))
      passwordForm.setValue("password")
      await validation.validate()
      await passwordValidation.validate()
      expect(validation.failedRules.min).toBeTruthy()

      // confirmed
      form.setValue("password")
      passwordForm.setValue("aaaaaaaa")
      await validation.validate()
      await passwordValidation.validate()
      expect(validation.failedRules.confirmed).toBeTruthy()

      // valid
      form.setValue("password")
      passwordForm.setValue("password")
      await validation.validate()
      await passwordValidation.validate()
      expect(Object.keys(validation.failedRules).length).toBe(0)
    })
  })
})
