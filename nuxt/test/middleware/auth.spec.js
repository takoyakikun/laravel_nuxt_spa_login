import Vuex from "vuex"
import storeConfig from "~/test/storeConfig"
import axios from "axios"
import api from "~/test/api"
import Auth from "~/middleware/auth"

jest.useFakeTimers()
jest.mock("axios")

let store
let redirect
let $api
beforeEach(() => {
  store = new Vuex.Store(storeConfig)
  redirect = jest.fn()
  $api = api({ $axios: axios, store })
})

afterEach(() => {
  jest.clearAllMocks()
})

describe(__filename, () => {
  beforeEach(() => {})

  test("ログインしていない", async () => {
    // ミドルウェアを実行
    await Auth({ store: store, redirect: redirect, app: { $api } })
    jest.runAllTimers()

    // ログインしていないのでfalse
    expect(store.getters["auth/userExists"]).toBeFalsy()

    // ログインページへリダイレクト
    expect(redirect).toHaveBeenCalled()
    expect(redirect).toHaveBeenCalledWith("/login")
  })

  describe("ログインしている", () => {
    let axiosGet
    beforeEach(() => {
      // spyOn
      axiosGet = jest.spyOn(axios, "get")

      // ログインユーザーデータをストアに追加
      store.state.auth.user = {
        name: "テスト",
        email: "test@test.com",
        role: 3
      }
    })

    test("メール認証をしていない", async () => {
      // メール認証アクセス権限レスポンス
      const response = {
        status: 200,
        data: [false]
      }
      // axiosのレスポンスをモックする
      axios.get.mockImplementation(url => {
        return Promise.resolve(response)
      })
      store.$axios = axios

      // ミドルウェアを実行
      await Auth({ store: store, redirect: redirect, app: { $api } })
      jest.runAllTimers()

      // ログインしているのでtrue
      expect(store.getters["auth/userExists"]).toBeTruthy()

      // メール認証アクセス権限のAPI送信をした
      expect(axiosGet).toHaveBeenCalled()
      expect(axiosGet).toHaveBeenCalledWith("/api/permission/verified")

      // メール認証していないのでfalse
      expect(store.getters["auth/permission"]("verified")).toBeFalsy()

      // 認証メール再送信ページへリダイレクト
      expect(redirect).toHaveBeenCalled()
      expect(redirect).toHaveBeenCalledWith("/resend")
    })

    test("ログインしていてメール認証もしている", async () => {
      // メール認証アクセス権限レスポンス
      const response = {
        status: 200,
        data: [true]
      }
      // axiosのレスポンスをモックする
      axios.get.mockImplementation(url => {
        return Promise.resolve(response)
      })
      store.$axios = axios

      // ミドルウェアを実行
      await Auth({ store: store, redirect: redirect, app: { $api } })
      jest.runAllTimers()

      // ログインしているのでtrue
      expect(store.getters["auth/userExists"]).toBeTruthy()

      // メール認証アクセス権限のAPI送信をした
      expect(axiosGet).toHaveBeenCalled()
      expect(axiosGet).toHaveBeenCalledWith("/api/permission/verified")

      // メール認証しているのでtrue
      expect(store.getters["auth/permission"]("verified")).toBeTruthy()

      // リダイレクトしない
      expect(redirect).not.toHaveBeenCalled()
    })
  })
})
