import { createLocalVue, shallowMount, mount } from "@vue/test-utils"
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

  describe("項目表示テスト", () => {
    let wrapper
    beforeEach(() => {
      wrapper = mount(UserForm, {
        localVue,
        store,
        vuetify,
        sync: false,
        propsData: {
          drawer: false
        }
      })
    })

    test("自ユーザー", async () => {
      // 自ユーザー設定
      await wrapper.setProps({ myuser: true })

      // アクセス権限フォーム項目
      expect(wrapper.find("[data-test='roleForm']").exists()).toBeFalsy()
    })

    test("自ユーザー以外", async () => {
      // 自ユーザー設定
      await wrapper.setProps({ myuser: false })

      // アクセス権限フォーム項目
      expect(wrapper.find("[data-test='roleForm']").exists()).toBeTruthy()
    })

    test("フォームタイプ無し", async () => {
      // createフォームタイプ設定
      await wrapper.setProps({ formType: "" })

      // パスワードフォーム項目
      expect(wrapper.find("[data-test='passwordForm']").exists()).toBeFalsy()

      // パスワード(確認)フォーム項目
      expect(
        wrapper.find("[data-test='passwordConfirmationForm']").exists()
      ).toBeFalsy()
    })

    test("createフォームタイプ", async () => {
      // createフォームタイプ設定
      await wrapper.setProps({ formType: "create" })

      // パスワードフォーム項目
      expect(wrapper.find("[data-test='passwordForm']").exists()).toBeTruthy()

      // パスワード(確認)フォーム項目
      expect(
        wrapper.find("[data-test='passwordConfirmationForm']").exists()
      ).toBeTruthy()
    })

    test("usersCreateフォームタイプ", async () => {
      // createフォームタイプ設定
      await wrapper.setProps({ formType: "usersCreate" })

      // パスワードフォーム項目
      expect(wrapper.find("[data-test='passwordForm']").exists()).toBeFalsy()

      // パスワード(確認)フォーム項目
      expect(
        wrapper.find("[data-test='passwordConfirmationForm']").exists()
      ).toBeFalsy()
    })

    test("editフォームタイプ", async () => {
      // createフォームタイプ設定
      await wrapper.setProps({ formType: "edit" })

      // パスワードフォーム項目
      expect(wrapper.find("[data-test='passwordForm']").exists()).toBeFalsy()

      // パスワード(確認)フォーム項目
      expect(
        wrapper.find("[data-test='passwordConfirmationForm']").exists()
      ).toBeFalsy()
    })
  })

  describe("フォームバリデーションテスト", () => {
    let wrapper
    beforeEach(() => {
      wrapper = mount(UserForm, {
        localVue,
        store,
        vuetify,
        sync: false
      })
    })

    test("ユーザー名", async () => {
      const form = wrapper.find("input[name='name']")
      const validation = wrapper.vm.$refs.nameValidation

      // required
      form.setValue("")
      await validation.validate()
      expect(validation.failedRules.required).toBeTruthy()

      // max
      form.setValue("a".repeat(256))
      await validation.validate()
      expect(validation.failedRules.max).toBeTruthy()

      // valid
      form.setValue("テスト")
      await validation.validate()
      expect(Object.keys(validation.failedRules).length).toBe(0)
    })

    test("メールアドレス", async () => {
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
