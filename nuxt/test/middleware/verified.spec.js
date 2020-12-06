import Vuex from "vuex"
import storeConfig from "@/test/storeConfig"
import axios from "axios"
import Verified from "@/middleware/verified"

let store
let redirect

describe("auth", () => {
  beforeEach(() => {
    store = new Vuex.Store(storeConfig)
    redirect = jest.fn()
  })

  test("ログインしていない", async () => {
    // ミドルウェアを実行
    await Verified({ store: store, redirect: redirect })

    // ログインしていないのでfalse
    expect(store.getters["auth/userExists"]).toBeFalsy()

    // リダイレクトしない
    expect(redirect).not.toHaveBeenCalled()
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
      await Verified({ store: store, redirect: redirect })

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

    test("メール認証している", async () => {
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
      await Verified({ store: store, redirect: redirect })

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
