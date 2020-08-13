import { shallowMount } from "@vue/test-utils"
import Vuetify from "vuetify"
import Vuex from "vuex"
import axios from "axios"
import storeConfig from "@/test/storeConfig"
import { ValidationProvider, ValidationObserver } from "vee-validate"
import { VTextField } from "vuetify/lib"
import Register from "@/components/register/register"
import UserForm from "@/components/users/userForm"

let store = new Vuex.Store(storeConfig)
let vuetify = new Vuetify()

jest.useFakeTimers()

describe("components/register", () => {
  describe("register", () => {
    let wrapper
    beforeEach(() => {
      const router = { push: jest.fn() }
      wrapper = shallowMount(Register, {
        store,
        vuetify,
        stubs: {
          ValidationObserver,
          ValidationProvider,
          UserForm,
          VTextField
        },
        sync: false,
        mocks: { $router: router }
      })
    })

    test("is a Vue instance", () => {
      expect(wrapper.vm).toBeTruthy()
    })

    test("ユーザー追加失敗(フロント側エラー)", async () => {
      // spyOn
      const registerFormValidation = jest.spyOn(
        wrapper.vm.$refs.registerForm,
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

      // ユーザー追加処理
      await wrapper.vm.submit()
      jest.runAllTimers()

      // バリデーションチェックをした
      expect(registerFormValidation).toHaveBeenCalled()

      // バリデーションエラー
      expect(
        Object.keys(wrapper.vm.$refs.registerForm.errors)
      ).not.toHaveLength(0)

      // API送信をしない
      expect(axiosPost).not.toHaveBeenCalled()
    })

    test("ユーザー追加失敗(API側エラー)", async () => {
      // spyOn
      const registerFormValidation = jest.spyOn(
        wrapper.vm.$refs.registerForm,
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

      // フォームを入力してユーザー追加処理
      wrapper.find("input[name='name']").setValue("テスト")
      wrapper.find("input[name='email']").setValue("test@test.com")
      wrapper.find("input[name='password']").setValue("password")
      wrapper.find("input[name='password_confirmation']").setValue("password")
      await wrapper.vm.submit()
      jest.runAllTimers()

      // バリデーションチェックをした
      expect(registerFormValidation).toHaveBeenCalled()

      // API送信をした
      expect(axiosPost).toHaveBeenCalled()
      expect(axiosPost).toHaveBeenCalledWith("/api/register", {
        name: "テスト",
        email: "test@test.com",
        password: "password",
        password_confirmation: "password"
      })

      // snackbarのエラー表示
      expect(wrapper.vm.$store.getters["snackbar/text"]).toBe(
        "新規ユーザーの作成に失敗しました。"
      )
      expect(wrapper.vm.$store.getters["snackbar/options"].color).toBe("error")
    })

    test("ユーザー追加成功したが認証で失敗", async () => {
      // spyOn
      const registerFormValidation = jest.spyOn(
        wrapper.vm.$refs.registerForm,
        "validate"
      )
      const axiosPost = jest.spyOn(axios, "post")
      const routerPush = jest.spyOn(wrapper.vm.$router, "push")

      // 正常なレスポンス
      const response = {
        status: 200
      }
      // エラーレスポンス
      const responseError = {
        status: 422
      }
      // axiosのレスポンスをモックする
      axios.post
        .mockImplementationOnce(url => {
          return Promise.resolve(response)
        })
        .mockImplementationOnce(url => {
          return Promise.resolve(responseError)
        })
      wrapper.vm.$store.$axios = axios

      // フォームを入力してログイン処理
      wrapper.find("input[name='name']").setValue("テスト")
      wrapper.find("input[name='email']").setValue("test@test.com")
      wrapper.find("input[name='password']").setValue("password")
      wrapper.find("input[name='password_confirmation']").setValue("password")
      await wrapper.vm.submit()
      jest.runAllTimers()

      // バリデーションチェックをした
      expect(registerFormValidation).toHaveBeenCalled()

      // API送信をした
      expect(axiosPost).toHaveBeenCalled()
      expect(axiosPost).toHaveBeenCalledWith("/api/register", {
        name: "テスト",
        email: "test@test.com",
        password: "password",
        password_confirmation: "password"
      })
      expect(axiosPost).toHaveBeenCalledWith("/api/login", {
        email: "test@test.com",
        password: "password"
      })

      // ログインページへリダイレクトした
      expect(routerPush).toHaveBeenCalled()
      expect(routerPush).toHaveBeenCalledWith("/login")

      // snackbarのエラー表示
      expect(wrapper.vm.$store.getters["snackbar/text"]).toBe(
        "認証に失敗しました。"
      )
      expect(wrapper.vm.$store.getters["snackbar/options"].color).toBe("error")
    })

    test("ユーザー追加成功", async () => {
      // spyOn
      const registerFormValidation = jest.spyOn(
        wrapper.vm.$refs.registerForm,
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

      // フォームを入力してログイン処理
      wrapper.find("input[name='name']").setValue("テスト")
      wrapper.find("input[name='email']").setValue("test@test.com")
      wrapper.find("input[name='password']").setValue("password")
      wrapper.find("input[name='password_confirmation']").setValue("password")
      await wrapper.vm.submit()
      jest.runAllTimers()

      // バリデーションチェックをした
      expect(registerFormValidation).toHaveBeenCalled()

      // API送信をした
      expect(axiosPost).toHaveBeenCalled()
      expect(axiosPost).toHaveBeenCalledWith("/api/register", {
        name: "テスト",
        email: "test@test.com",
        password: "password",
        password_confirmation: "password"
      })
      expect(axiosPost).toHaveBeenCalledWith("/api/login", {
        email: "test@test.com",
        password: "password"
      })

      // メール認証ページへリダイレクトした
      expect(routerPush).toHaveBeenCalled()
      expect(routerPush).toHaveBeenCalledWith("/resend")

      // snackbarの完了表示
      expect(wrapper.vm.$store.getters["snackbar/text"]).toBe(
        "新規ユーザーを作成しました。"
      )
      expect(wrapper.vm.$store.getters["snackbar/options"].color).toBe(
        "success"
      )
    })

    test("loading中はログイン処理不可", async () => {
      // spyOn
      const registerFormValidation = jest.spyOn(
        wrapper.vm.$refs.registerForm,
        "validate"
      )

      // loading中の設定
      wrapper.setData({
        loading: true
      })

      // ログイン処理
      await wrapper.vm.submit()
      jest.runAllTimers()

      // バリデーションチェックをしない
      expect(registerFormValidation).not.toHaveBeenCalled()
    })
  })
})
