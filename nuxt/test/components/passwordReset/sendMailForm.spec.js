import { createLocalVue, shallowMount, mount } from "@vue/test-utils"
import Vuetify from "vuetify"
import Vuex from "vuex"
import storeConfig from "@/test/storeConfig"
import SendMailForm from "@/components/passwordReset/sendMailForm"
import Form from "@/components/form/form"
import { ValidationObserver } from "vee-validate"

const localVue = createLocalVue()
localVue.use(Vuex)

const vuetify = new Vuetify()

jest.useFakeTimers()

let store
beforeEach(() => {
  store = new Vuex.Store(storeConfig)
})

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
    let formWrapper
    beforeEach(() => {
      wrapper = mount(ValidationObserver, {
        localVue,
        store,
        vuetify,
        sync: false,
        slots: {
          default: SendMailForm
        }
      })
      formWrapper = wrapper.findComponent(SendMailForm)
    })

    describe("メールアドレス", () => {
      let form
      let validation
      beforeEach(() => {
        form = wrapper.find("input[name='email']")
        validation = formWrapper.vm.$refs.emailValidation
      })

      test("required", async () => {
        form.setValue("")
        await wrapper.vm.validate()
        expect(validation.getFailedRules().required).toBeTruthy()
      })

      test("max", async () => {
        form.setValue("a".repeat(256))
        await wrapper.vm.validate()
        expect(validation.getFailedRules().max).toBeTruthy()
      })

      test("email", async () => {
        form.setValue("aaa")
        await wrapper.vm.validate()
        expect(validation.getFailedRules().email).toBeTruthy()
      })

      test("valid", async () => {
        form.setValue("test@test.com")
        await wrapper.vm.validate()
        expect(Object.keys(validation.getFailedRules()).length).toBe(0)
      })
    })
  })
})
