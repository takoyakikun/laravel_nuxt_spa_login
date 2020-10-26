import { createLocalVue, shallowMount, mount } from "@vue/test-utils"
import Vuetify from "vuetify"
import Vuex from "vuex"
import storeConfig from "@/test/storeConfig"
import SendMailForm from "@/components/passwordReset/sendMailForm"
import Form from "@/components/form/form"

const localVue = createLocalVue()
localVue.use(Vuex)

const store = new Vuex.Store(storeConfig)
const vuetify = new Vuetify()

jest.useFakeTimers()

afterEach(() => {
  jest.clearAllMocks()
})

describe("components/passwordReset/sendMailForm", () => {
  describe("テスト", () => {
    let wrapper
    beforeEach(() => {
      wrapper = shallowMount(SendMailForm, {
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
      wrapper = mount(SendMailForm, {
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
  })
})
