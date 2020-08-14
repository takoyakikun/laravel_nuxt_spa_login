import { createLocalVue, shallowMount } from "@vue/test-utils"
import Vuetify from "vuetify"
import Vuex from "vuex"
import axios from "axios"
import storeConfig from "@/test/storeConfig"
import { ValidationProvider, ValidationObserver } from "vee-validate"
import { VTextField } from "vuetify/lib"
import PasswordReset from "@/components/passwordReset/index"
import Token from "@/components/passwordReset/_token"
import PasswordResetForm from "@/components/passwordReset/passwordResetForm"
import SendMailForm from "@/components/passwordReset/sendMailForm"

const localVue = createLocalVue()

let store = new Vuex.Store(storeConfig)
let vuetify = new Vuetify()

jest.useFakeTimers()

afterEach(() => {
  jest.clearAllMocks()
})

describe("components/passwordReset", () => {
  describe("index", () => {
    let wrapper
    beforeEach(() => {
      wrapper = shallowMount(PasswordReset, {
        localVue,
        store,
        vuetify,
        stubs: {
          ValidationObserver,
          ValidationProvider,
          SendMailForm,
          VTextField
        },
        sync: false
      })
    })

    test("is a Vue instance", () => {
      expect(wrapper.vm).toBeTruthy()
    })

    test("パスワードリセットメール送信失敗(フロント側エラー)", async () => {
      // spyOn
      const sendMailValidate = jest.spyOn(
        wrapper.vm.$refs.sendMailValidate,
        "validate"
      )
      const axiosPost = jest.spyOn(axios, "post")

      // エラーレスポンス
      const response = {
        status: 422
      }
      // axiosのレスポンスをモックする
      axios.post.mockImplementation(url => {
        return Promise.resolve(response)
      })
      wrapper.vm.$store.$axios = axios

      // パスワードリセットメール送信処理
      await wrapper.vm.sendMail()
      jest.runAllTimers()

      // バリデーションチェックをした
      expect(sendMailValidate).toHaveBeenCalled()

      // バリデーションエラー
      expect(
        Object.keys(wrapper.vm.$refs.sendMailValidate.errors)
      ).not.toHaveLength(0)

      // API送信をしない
      expect(axiosPost).not.toHaveBeenCalled()
    })

    test("パスワードリセットメール送信失敗(API側エラー)", async () => {
      // spyOn
      const sendMailValidate = jest.spyOn(
        wrapper.vm.$refs.sendMailValidate,
        "validate"
      )
      const axiosPost = jest.spyOn(axios, "post")

      // エラーレスポンス
      const response = {
        status: 422
      }
      // axiosのレスポンスをモックする
      axios.post.mockImplementation(url => {
        return Promise.resolve(response)
      })
      wrapper.vm.$store.$axios = axios

      // フォームを入力してパスワードリセットメール送信処理
      wrapper.find("input[name='email']").setValue("test@test.com")
      await wrapper.vm.sendMail()
      jest.runAllTimers()

      // バリデーションチェックをした
      expect(sendMailValidate).toHaveBeenCalled()

      // API送信をした
      expect(axiosPost).toHaveBeenCalled()
      expect(axiosPost).toHaveBeenCalledWith("/api/password/email", {
        email: "test@test.com"
      })

      // snackbarのエラー表示
      expect(wrapper.vm.$store.getters["snackbar/text"]).toBe(
        "パスワードリセットメール送信に失敗しました。"
      )
      expect(wrapper.vm.$store.getters["snackbar/options"].color).toBe("error")
    })

    test("パスワードリセットメール送信成功", async () => {
      // spyOn
      const sendMailValidate = jest.spyOn(
        wrapper.vm.$refs.sendMailValidate,
        "validate"
      )
      const axiosPost = jest.spyOn(axios, "post")

      // 正常なレスポンス
      const response = {
        status: 200
      }
      // axiosのレスポンスをモックする
      axios.post.mockImplementation(url => {
        return Promise.resolve(response)
      })
      wrapper.vm.$store.$axios = axios

      // フォームを入力してパスワードリセットメール送信処理
      wrapper.find("input[name='email']").setValue("test@test.com")
      await wrapper.vm.sendMail()
      jest.runAllTimers()

      // バリデーションチェックをした
      expect(sendMailValidate).toHaveBeenCalled()

      // API送信をした
      expect(axiosPost).toHaveBeenCalled()
      expect(axiosPost).toHaveBeenCalledWith("/api/password/email", {
        email: "test@test.com"
      })

      // 送信済みメッセージを表示
      expect(wrapper.vm.send).toBeTruthy()
    })

    test("loading中はパスワードリセットメール送信不可", async () => {
      // spyOn
      const sendMailValidate = jest.spyOn(
        wrapper.vm.$refs.sendMailValidate,
        "validate"
      )

      // loading中の設定
      wrapper.setData({
        loading: true
      })

      // パスワードリセットメール送信
      await wrapper.vm.sendMail()
      jest.runAllTimers()

      // バリデーションチェックをしない
      expect(sendMailValidate).not.toHaveBeenCalled()
    })
  })

  describe("_token", () => {
    let wrapper
    beforeEach(() => {
      const router = { push: jest.fn() }
      const route = { params: { token: "test" } }
      wrapper = shallowMount(Token, {
        localVue,
        store,
        vuetify,
        stubs: {
          ValidationObserver,
          ValidationProvider,
          PasswordResetForm,
          VTextField
        },
        sync: false,
        mocks: { $router: router, $nuxt: { $route: route } }
      })
    })

    test("is a Vue instance", () => {
      expect(wrapper.vm).toBeTruthy()
    })

    test("パスワードリセット失敗(フロント側エラー)", async () => {
      // spyOn
      const passwordResetValidate = jest.spyOn(
        wrapper.vm.$refs.passwordResetValidate,
        "validate"
      )
      const axiosPost = jest.spyOn(axios, "post")

      // エラーレスポンス
      const response = {
        status: 422
      }
      // axiosのレスポンスをモックする
      axios.post.mockImplementation(url => {
        return Promise.resolve(response)
      })
      wrapper.vm.$store.$axios = axios

      // パスワードリセット処理
      await wrapper.vm.passwordReset()
      jest.runAllTimers()

      // バリデーションチェックをした
      expect(passwordResetValidate).toHaveBeenCalled()

      // バリデーションエラー
      expect(
        Object.keys(wrapper.vm.$refs.passwordResetValidate.errors)
      ).not.toHaveLength(0)

      // API送信をしない
      expect(axiosPost).not.toHaveBeenCalled()
    })

    test("パスワードリセット失敗(API側エラー)", async () => {
      // spyOn
      const passwordResetValidate = jest.spyOn(
        wrapper.vm.$refs.passwordResetValidate,
        "validate"
      )
      const axiosPost = jest.spyOn(axios, "post")

      // エラーレスポンス
      const response = {
        status: 422
      }
      // axiosのレスポンスをモックする
      axios.post.mockImplementation(url => {
        return Promise.resolve(response)
      })
      wrapper.vm.$store.$axios = axios

      // フォームを入力してパスワードリセット処理
      wrapper.find("input[name='email']").setValue("test@test.com")
      wrapper.find("input[name='password']").setValue("password")
      wrapper.find("input[name='password_confirmation']").setValue("password")
      await wrapper.vm.passwordReset()
      jest.runAllTimers()

      // バリデーションチェックをした
      expect(passwordResetValidate).toHaveBeenCalled()

      // API送信をした
      expect(axiosPost).toHaveBeenCalled()
      expect(axiosPost).toHaveBeenCalledWith("/api/password/reset", {
        email: "test@test.com",
        password: "password",
        password_confirmation: "password",
        token: "test"
      })

      // snackbarのエラー表示
      expect(wrapper.vm.$store.getters["snackbar/text"]).toBe(
        "パスワードリセットに失敗しました。"
      )
      expect(wrapper.vm.$store.getters["snackbar/options"].color).toBe("error")
    })

    test("パスワードリセット成功", async () => {
      // spyOn
      const passwordResetValidate = jest.spyOn(
        wrapper.vm.$refs.passwordResetValidate,
        "validate"
      )
      const axiosPost = jest.spyOn(axios, "post")
      const routerPush = jest.spyOn(wrapper.vm.$router, "push")

      // 正常なレスポンス
      const response = {
        status: 200
      }
      // axiosのレスポンスをモックする
      axios.post.mockImplementation(url => {
        return Promise.resolve(response)
      })
      wrapper.vm.$store.$axios = axios

      // フォームを入力してパスワードリセット処理
      wrapper.find("input[name='email']").setValue("test@test.com")
      wrapper.find("input[name='password']").setValue("password")
      wrapper.find("input[name='password_confirmation']").setValue("password")
      await wrapper.vm.passwordReset()
      jest.runAllTimers()

      // バリデーションチェックをした
      expect(passwordResetValidate).toHaveBeenCalled()

      // API送信をした
      expect(axiosPost).toHaveBeenCalled()
      expect(axiosPost).toHaveBeenCalledWith("/api/password/reset", {
        email: "test@test.com",
        password: "password",
        password_confirmation: "password",
        token: "test"
      })

      // ログインページへリダイレクトした
      expect(routerPush).toHaveBeenCalled()
      expect(routerPush).toHaveBeenCalledWith("/")

      // snackbarの完了表示
      expect(wrapper.vm.$store.getters["snackbar/text"]).toBe(
        "パスワードリセットしました。"
      )
      expect(wrapper.vm.$store.getters["snackbar/options"].color).toBe(
        "success"
      )
    })

    test("loading中はパスワードリセット不可", async () => {
      // spyOn
      const passwordResetValidate = jest.spyOn(
        wrapper.vm.$refs.passwordResetValidate,
        "validate"
      )

      // loading中の設定
      wrapper.setData({
        loading: true
      })

      // パスワードリセット処理
      await wrapper.vm.passwordReset()
      jest.runAllTimers()

      // バリデーションチェックをしない
      expect(passwordResetValidate).not.toHaveBeenCalled()
    })
  })

  describe("passwordResetForm", () => {
    let wrapper
    beforeEach(() => {
      wrapper = shallowMount(PasswordResetForm, {
        localVue,
        store,
        vuetify
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

  describe("sendMailForm", () => {
    let wrapper
    beforeEach(() => {
      wrapper = shallowMount(SendMailForm, {
        localVue,
        store,
        vuetify
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
