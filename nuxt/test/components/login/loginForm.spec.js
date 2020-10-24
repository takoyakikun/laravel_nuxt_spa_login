import { createLocalVue, shallowMount, mount } from "@vue/test-utils"
import Vuetify from "vuetify"
import Vuex from "vuex"
import storeConfig from "@/test/storeConfig"
import LoginForm from "@/components/login/loginForm"
import Form from "@/components/form/form"

const localVue = createLocalVue()
localVue.use(Vuex)

const store = new Vuex.Store(storeConfig)
const vuetify = new Vuetify()

jest.useFakeTimers()

afterEach(() => {
  jest.clearAllMocks()
})

describe("components/login/loginForm", () => {
  describe("テスト", () => {
    let wrapper
    beforeEach(() => {
      wrapper = shallowMount(LoginForm, {
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
      wrapper = mount(LoginForm, {
        localVue,
        store,
        vuetify,
        sync: false
      })
    })

    test("Login", async () => {
      const form = wrapper.find("input[name='login']")
      const validation = wrapper.vm.$refs.loginValidation

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

    test("Password", async () => {
      const form = wrapper.find("input[name='password']")
      const validation = wrapper.vm.$refs.passwordValidation

      // required
      form.setValue("")
      await validation.validate()
      expect(validation.failedRules.required).toBeTruthy()

      // valid
      form.setValue("password")
      await validation.validate()
      expect(Object.keys(validation.failedRules).length).toBe(0)
    })
  })
})
