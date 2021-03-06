import axios from 'axios'
import makeMiddlewareOptions from '~/test/makeMiddlewareOptions'
import Admin from '~/middleware/admin'

jest.useFakeTimers()
jest.mock('axios')

let store
let redirect
let middlewareOptions
beforeEach(() => {
  middlewareOptions = makeMiddlewareOptions(axios)
  store = middlewareOptions.store
  redirect = middlewareOptions.redirect
})

afterEach(() => {
  jest.clearAllMocks()
})

describe(__filename, () => {
  test('ログインしていない', async () => {
    // ミドルウェアを実行
    await Admin(middlewareOptions)
    jest.runAllTimers()

    // ログインしていないのでfalse
    expect(store.getters['auth/userExists']).toBeFalsy()

    // ログインページへリダイレクト
    expect(redirect).toHaveBeenCalled()
    expect(redirect).toHaveBeenCalledWith('/login')
  })

  describe('ログインしている', () => {
    let axiosGet
    beforeEach(() => {
      // spyOn
      axiosGet = jest.spyOn(axios, 'get')
    })
    describe('管理者権限以外', () => {
      let responseAdmin
      beforeEach(() => {
        // 管理者アクセス権限レスポンス
        responseAdmin = {
          status: 200,
          data: [false]
        }

        // axiosのレスポンスをモックする
        axios.get.mockImplementationOnce(url => {
          return Promise.resolve(responseAdmin)
        })

        // ログインユーザーデータをストアに追加
        store.state.auth.user = {
          name: 'テスト',
          email: 'test@test.com',
          role: 3
        }
      })

      test('メール認証をしていない', async () => {
        // メール認証アクセス権限レスポンス
        const responseVerified = {
          status: 200,
          data: [false]
        }
        // axiosのレスポンスをモックする
        axios.get.mockImplementationOnce(url => {
          return Promise.resolve(responseVerified)
        })

        // ミドルウェアを実行
        await Admin(middlewareOptions)
        jest.runAllTimers()

        // ログインしているのでtrue
        expect(store.getters['auth/userExists']).toBeTruthy()

        // 管理者アクセス権限のAPI送信をした
        expect(axiosGet).toHaveBeenCalled()
        expect(axiosGet).toHaveBeenCalledWith('/api/permission/admin-higher')

        // 管理者権限以外なのでfalse
        expect(store.getters['auth/permission']('admin-higher')).toBeFalsy()

        // メール認証アクセス権限のAPI送信をした
        expect(axiosGet).toHaveBeenCalled()
        expect(axiosGet).toHaveBeenCalledWith('/api/permission/verified')

        // メール認証していないのでfalse
        expect(store.getters['auth/permission']('verified')).toBeFalsy()

        // ログインページへリダイレクト
        expect(redirect).toHaveBeenCalled()
        expect(redirect).toHaveBeenCalledWith('/')
      })

      test('メール認証している', async () => {
        // メール認証アクセス権限レスポンス
        const responseVerified = {
          status: 200,
          data: [true]
        }
        // axiosのレスポンスをモックする
        axios.get.mockImplementationOnce(url => {
          return Promise.resolve(responseVerified)
        })

        // ミドルウェアを実行
        await Admin(middlewareOptions)
        jest.runAllTimers()

        // ログインしているのでtrue
        expect(store.getters['auth/userExists']).toBeTruthy()

        // 管理者アクセス権限のAPI送信をした
        expect(axiosGet).toHaveBeenCalled()
        expect(axiosGet).toHaveBeenCalledWith('/api/permission/admin-higher')

        // 管理者権限以外なのでfalse
        expect(store.getters['auth/permission']('admin-higher')).toBeFalsy()

        // メール認証アクセス権限のAPI送信をした
        expect(axiosGet).toHaveBeenCalled()
        expect(axiosGet).toHaveBeenCalledWith('/api/permission/verified')

        // メール認証しているのでtrue
        expect(store.getters['auth/permission']('verified')).toBeTruthy()

        // ログインページへリダイレクト
        expect(redirect).toHaveBeenCalled()
        expect(redirect).toHaveBeenCalledWith('/')
      })
    })

    describe('管理者権限', () => {
      let responseAdmin
      beforeEach(() => {
        // spyOn
        axiosGet = jest.spyOn(axios, 'get')

        // 管理者アクセス権限レスポンス
        responseAdmin = {
          status: 200,
          data: [true]
        }

        // axiosのレスポンスをモックする
        axios.get.mockImplementationOnce(url => {
          return Promise.resolve(responseAdmin)
        })

        // ログインユーザーデータをストアに追加
        store.state.auth.user = {
          name: 'テスト',
          email: 'test@test.com',
          role: 2
        }
      })

      test('メール認証をしていない', async () => {
        // メール認証アクセス権限レスポンス
        const responseVerified = {
          status: 200,
          data: [false]
        }
        // axiosのレスポンスをモックする
        axios.get.mockImplementationOnce(url => {
          return Promise.resolve(responseVerified)
        })

        // ミドルウェアを実行
        await Admin(middlewareOptions)
        jest.runAllTimers()

        // ログインしているのでtrue
        expect(store.getters['auth/userExists']).toBeTruthy()

        // 管理者アクセス権限のAPI送信をした
        expect(axiosGet).toHaveBeenCalled()
        expect(axiosGet).toHaveBeenCalledWith('/api/permission/admin-higher')

        // 管理者権限なのでtrue
        expect(store.getters['auth/permission']('admin-higher')).toBeTruthy()

        // メール認証アクセス権限のAPI送信をした
        expect(axiosGet).toHaveBeenCalled()
        expect(axiosGet).toHaveBeenCalledWith('/api/permission/verified')

        // メール認証していないのでfalse
        expect(store.getters['auth/permission']('verified')).toBeFalsy()

        // 認証メール再送信ページへリダイレクト
        expect(redirect).toHaveBeenCalled()
        expect(redirect).toHaveBeenCalledWith('/resend')
      })

      test('メール認証している', async () => {
        // メール認証アクセス権限レスポンス
        const responseVerified = {
          status: 200,
          data: [true]
        }
        // axiosのレスポンスをモックする
        axios.get.mockImplementationOnce(url => {
          return Promise.resolve(responseVerified)
        })

        // ミドルウェアを実行
        await Admin(middlewareOptions)
        jest.runAllTimers()

        // ログインしているのでtrue
        expect(store.getters['auth/userExists']).toBeTruthy()

        // 管理者アクセス権限のAPI送信をした
        expect(axiosGet).toHaveBeenCalled()
        expect(axiosGet).toHaveBeenCalledWith('/api/permission/admin-higher')

        // 管理者権限なのでtrue
        expect(store.getters['auth/permission']('admin-higher')).toBeTruthy()

        // メール認証アクセス権限のAPI送信をした
        expect(axiosGet).toHaveBeenCalled()
        expect(axiosGet).toHaveBeenCalledWith('/api/permission/verified')

        // メール認証しているのでtrue
        expect(store.getters['auth/permission']('verified')).toBeTruthy()

        // リダイレクトしない
        expect(redirect).not.toHaveBeenCalled()
      })
    })
  })
})
