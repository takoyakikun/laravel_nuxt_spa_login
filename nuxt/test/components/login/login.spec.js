import { shallowMount, RouterLinkStub } from "@vue/test-utils"
import Vuetify from "vuetify"
import Vuex from "vuex"
import axios from "axios"
import storeConfig from "@/test/storeConfig"
import { ValidationProvider, ValidationObserver } from "vee-validate"
import { VTextField } from "vuetify/lib"
import Login from "@/components/login/login"
import LoginForm from "@/components/login/loginForm"

let store = new Vuex.Store(storeConfig)
let vuetify = new Vuetify()

jest.useFakeTimers()

describe("components/login", () => {
  describe("login", () => {
    let wrapper
    beforeEach(() => {
      const router = { push: jest.fn() }
      wrapper = shallowMount(Login, {
        store,
        vuetify,
        stubs: {
          ValidationObserver,
          ValidationProvider,
          NuxtLink: RouterLinkStub,
          LoginForm,
          VTextField
        },
        sync: false,
        mocks: { $router: router }
      })
    })

    test("is a Vue instance", () => {
      expect(wrapper.vm).toBeTruthy()
    })

    test("ログイン失敗(フロント側エラー)", async () => {
      // spyOn
      const loginFormValidation = jest.spyOn(
        wrapper.vm.$refs.loginForm,
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

      // ログイン処理
      await wrapper.vm.submit()
      jest.runAllTimers()

      // バリデーションチェックをした
      expect(loginFormValidation).toHaveBeenCalled()

      // バリデーションエラー
      expect(Object.keys(wrapper.vm.$refs.loginForm.errors)).not.toHaveLength(0)

      // API送信をしない
      expect(axiosPost).not.toHaveBeenCalled()
    })

    test("ログイン失敗(API側エラー)", async () => {
      // spyOn
      const loginFormValidation = jest.spyOn(
        wrapper.vm.$refs.loginForm,
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

      // フォームを入力してログイン処理
      wrapper.find("input[name='login']").setValue("test@test.com")
      wrapper.find("input[name='password']").setValue("password")
      await wrapper.vm.submit()
      jest.runAllTimers()

      // バリデーションチェックをした
      expect(loginFormValidation).toHaveBeenCalled()

      // API送信をした
      expect(axiosPost).toHaveBeenCalled()
      expect(axiosPost).toHaveBeenCalledWith("/api/login", {
        email: "test@test.com",
        password: "password"
      })

      // snackbarのエラー表示
      expect(wrapper.vm.$store.getters["snackbar/text"]).toBe(
        "認証に失敗しました。"
      )
      expect(wrapper.vm.$store.getters["snackbar/options"].color).toBe("error")
    })

    test("ログイン成功", async () => {
      // spyOn
      const loginFormValidation = jest.spyOn(
        wrapper.vm.$refs.loginForm,
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
      wrapper.find("input[name='login']").setValue("test@test.com")
      wrapper.find("input[name='password']").setValue("password")
      await wrapper.vm.submit()
      jest.runAllTimers()

      // バリデーションチェックをした
      expect(loginFormValidation).toHaveBeenCalled()

      // API送信をした
      expect(axiosPost).toHaveBeenCalled()
      expect(axiosPost).toHaveBeenCalledWith("/api/login", {
        email: "test@test.com",
        password: "password"
      })

      // Topへリダイレクトした
      expect(routerPush).toHaveBeenCalled()
      expect(routerPush).toHaveBeenCalledWith("/")
    })

    test("loading中はログイン処理不可", async () => {
      // spyOn
      const loginFormValidation = jest.spyOn(
        wrapper.vm.$refs.loginForm,
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
      expect(loginFormValidation).not.toHaveBeenCalled()
    })
  })

  describe("loginForm", () => {
    let wrapper
    beforeEach(() => {
      wrapper = shallowMount(LoginForm, {
        store,
        vuetify,
        stubs: {
          ValidationProvider,
          VTextField
        }
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
