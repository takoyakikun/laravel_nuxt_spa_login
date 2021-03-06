import { shallowMount, mount } from '@vue/test-utils'
import { localVue, router, vuetify } from '~/test/setLocalVue'
import axios from 'axios'
import setStore from '~/test/setStore'
import setApi from '~/test/setApi'
import setPlugin from '~/test/setPlugin'
import Resend from '~/components/resend/resend'

let store
beforeEach(() => {
  store = setStore(localVue)
  setApi(localVue, axios, store)
  setPlugin(localVue)
})

afterEach(() => {
  jest.clearAllMocks()
})

describe(__filename, () => {
  describe('resend', () => {
    let wrapper
    beforeEach(() => {
      router.push = jest.fn()

      wrapper = shallowMount(Resend, {
        localVue,
        store,
        router,
        vuetify
      })
    })

    test('is a Vue instance', () => {
      expect(wrapper.vm).toBeTruthy()
    })

    describe('認証メール再送信', () => {
      let axiosPost
      beforeEach(() => {
        // spyOn
        axiosPost = jest.spyOn(axios, 'post')
      })

      test('失敗', async () => {
        // エラーレスポンス
        const response = {
          status: 422
        }
        // axiosのレスポンスをモックする
        axios.post.mockImplementation(url => {
          return Promise.resolve(response)
        })

        // 認証メール再送信処理
        await wrapper.vm.resendMail()

        // API送信をした
        expect(axiosPost).toHaveBeenCalled()
        expect(axiosPost).toHaveBeenCalledWith('/api/email/resend')

        // snackbarのエラー表示
        expect(wrapper.vm.$snackbar.text).toBe(
          '認証メールの再送信に失敗しました。'
        )
        expect(wrapper.vm.$snackbar.options.color).toBe('error')
      })

      test('成功', async () => {
        // 正常なレスポンス
        const response = {
          status: 200
        }
        // axiosのレスポンスをモックする
        axios.post.mockImplementation(url => {
          return Promise.resolve(response)
        })

        // 認証メール再送信処理
        await wrapper.vm.resendMail()

        // API送信をした
        expect(axiosPost).toHaveBeenCalled()
        expect(axiosPost).toHaveBeenCalledWith('/api/email/resend')

        // 認証メール再送信完了メッセージを表示
        expect(wrapper.vm.resend).toBeTruthy()
      })

      test('loading中は処理不可', async () => {
        // loading中の設定
        wrapper.setData({
          loading: true
        })

        // 正常なレスポンス
        const response = {
          status: 200
        }
        // axiosのレスポンスをモックする
        axios.post.mockImplementation(url => {
          return Promise.resolve(response)
        })

        // 認証メール再送信処理
        await wrapper.vm.resendMail()

        // API送信をしない
        expect(axiosPost).not.toHaveBeenCalled()
      })
    })

    test('ログアウト', async () => {
      // spyOn
      const axiosPost = jest.spyOn(axios, 'post')
      const routerPush = jest.spyOn(wrapper.vm.$router, 'push')

      // 正常なレスポンス
      const response = {
        status: 200
      }
      // axiosのレスポンスをモックする
      axios.post.mockImplementation(url => {
        return Promise.resolve(response)
      })

      // ログアウト処理
      await wrapper.vm.logout()

      // API送信をした
      expect(axiosPost).toHaveBeenCalled()
      expect(axiosPost).toHaveBeenCalledWith('/api/logout')

      // Topへリダイレクトした
      expect(routerPush).toHaveBeenCalled()
      expect(routerPush).toHaveBeenCalledWith('/')
    })
  })

  describe('ボタン動作テスト', () => {
    let wrapper
    let resendMail
    let logout
    beforeEach(() => {
      resendMail = jest
        .spyOn(Resend.methods, 'resendMail')
        .mockReturnValue(true)
      logout = jest.spyOn(Resend.methods, 'logout').mockReturnValue(true)
      wrapper = mount(Resend, {
        localVue,
        store,
        vuetify
      })
    })

    describe('認証メール再送信ボタン', () => {
      test('resendMailContentButton', () => {
        // ボタンをクリック
        wrapper.find("[data-test='resendMailContentButton']").vm.$emit('click')

        // メソッドが実行されたか
        expect(resendMail).toHaveBeenCalled()
      })

      test('resendMailFooterButton', () => {
        // ボタンをクリック
        wrapper.find("[data-test='resendMailFooterButton']").vm.$emit('click')

        // メソッドが実行されたか
        expect(resendMail).toHaveBeenCalled()
      })
    })

    test('ログアウトボタン', () => {
      // ボタンをクリック
      wrapper.find("[data-test='logoutButton']").vm.$emit('click')

      // メソッドが実行されたか
      expect(logout).toHaveBeenCalled()
    })
  })
})
