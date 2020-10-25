import { createLocalVue, shallowMount, mount } from "@vue/test-utils"
import Vuetify from "vuetify"
import Vuex from "vuex"
import storeConfig from "@/test/storeConfig"
import PasswordResetForm from "@/components/passwordReset/passwordResetForm"
import Form from "@/components/form/form"

const localVue = createLocalVue()
localVue.use(Vuex)

const store = new Vuex.Store(storeConfig)
const vuetify = new Vuetify()

jest.useFakeTimers()

afterEach(() => {
  jest.clearAllMocks()
})

describe("components/passwordReset/passwordResetForm", () => {
  describe("テスト", () => {
    let wrapper
    beforeEach(() => {
      wrapper = shallowMount(PasswordResetForm, {
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
      wrapper = mount(PasswordResetForm, {
        localVue,
        store,
        vuetify,
        sync: false
      })
    })

    test("Email", async () => {
      const form = wrapper.find("input[name='email']")
      const validation = wrapper.vm.$refs.emailValidation

      // required
      form.setValue("")
      await validation.validate()
      expect(validation.failedRules.required).toBeTruthy()

      // max
      form.setValue("a".repeat(256))
      await validation.validate()
      expect(validation.failedRules.max).toBeTruthy()

      // email
      form.setValue("aaa")
      await validation.validate()
      expect(validation.failedRules.email).toBeTruthy()

      // valid
      form.setValue("test@test.com")
      await validation.validate()
      expect(Object.keys(validation.failedRules).length).toBe(0)
    })

    test("パスワード", async () => {
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

    test("パスワード(確認)", async () => {
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
