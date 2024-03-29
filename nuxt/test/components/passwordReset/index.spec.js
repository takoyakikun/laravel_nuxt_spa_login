import { mount } from '@vue/test-utils'
import { localVue, router, vuetify } from '~/test/setLocalVue'
import axios from 'axios'
import setStore from '~/test/setStore'
import setApi from '~/test/setApi'
import setPlugin from '~/test/setPlugin'
import PasswordReset from '~/components/passwordReset/index'

jest.useFakeTimers()

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
  describe('テスト', () => {
    let wrapper
    beforeEach(() => {
      router.push = jest.fn()
      wrapper = mount(PasswordReset, {
        localVue,
        store,
        router,
        vuetify
      })
    })

    test('is a Vue instance', () => {
      expect(wrapper.vm).toBeTruthy()
    })
  })

  describe('フォーム動作テスト', () => {
    let wrapper
    beforeEach(() => {
      router.push = jest.fn()
      wrapper = mount(PasswordReset, {
        localVue,
        store,
        router,
        vuetify
      })
    })

    describe('パスワードリセットメール送信', () => {
      let sendMailValidate
      let axiosPost
      beforeEach(async () => {
        // spyOn
        sendMailValidate = jest.spyOn(
          wrapper.vm.$refs.sendMailValidate,
          'validate'
        )
        axiosPost = jest.spyOn(axios, 'post')
      })

      describe('失敗', () => {
        beforeEach(() => {
          // エラーレスポンス
          const response = {
            status: 422
          }
          // axiosのレスポンスをモックする
          axios.post.mockImplementation(url => {
            return Promise.resolve(response)
          })
          wrapper.vm.$store.$axios = axios
        })

        test('フロント側エラー', async () => {
          // パスワードリセットメール送信処理
          await wrapper.vm.sendMail()
          jest.runAllTimers()
          await wrapper.vm.$nextTick()

          // バリデーションチェックをした
          expect(sendMailValidate).toHaveBeenCalled()

          // バリデーションエラー
          expect(
            Object.keys(wrapper.vm.$refs.sendMailValidate.errors)
          ).not.toHaveLength(0)

          // API送信をしない
          expect(axiosPost).not.toHaveBeenCalled()
        })

        test('API側エラー', async () => {
          // フォームを入力してパスワードリセットメール送信処理
          wrapper.find("input[name='login_id']").setValue('test@test.com')
          await wrapper.vm.sendMail()
          jest.runAllTimers()
          await wrapper.vm.$nextTick()

          // バリデーションチェックをした
          expect(sendMailValidate).toHaveBeenCalled()

          // API送信をした
          expect(axiosPost).toHaveBeenCalled()
          expect(axiosPost).toHaveBeenCalledWith('/api/password/email', {
            login_id: 'test@test.com'
          })

          // snackbarのエラー表示
          expect(wrapper.vm.$snackbar.text).toBe(
            'パスワードリセットメール送信に失敗しました。'
          )
          expect(wrapper.vm.$snackbar.options.color).toBe('error')
        })
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
        wrapper.vm.$store.$axios = axios

        // フォームを入力してパスワードリセットメール送信処理
        wrapper.find("input[name='login_id']").setValue('test@test.com')
        await wrapper.vm.sendMail()
        jest.runAllTimers()
        await wrapper.vm.$nextTick()

        // バリデーションチェックをした
        expect(sendMailValidate).toHaveBeenCalled()

        // API送信をした
        expect(axiosPost).toHaveBeenCalled()
        expect(axiosPost).toHaveBeenCalledWith('/api/password/email', {
          login_id: 'test@test.com'
        })

        // 送信済みメッセージを表示
        expect(wrapper.vm.send).toBeTruthy()
      })

      test('loading中はパスワードリセットメール送信不可', async () => {
        // loading中の設定
        wrapper.setData({
          loading: true
        })

        // パスワードリセットメール送信
        await wrapper.vm.sendMail()
        jest.runAllTimers()
        await wrapper.vm.$nextTick()

        // バリデーションチェックをしない
        expect(sendMailValidate).not.toHaveBeenCalled()
      })
    })
  })

  describe('ボタン動作テスト', () => {
    let wrapper
    let sendMail
    beforeEach(() => {
      sendMail = jest
        .spyOn(PasswordReset.methods, 'sendMail')
        .mockReturnValue(true)
      wrapper = mount(PasswordReset, {
        localVue,
        store,
        router,
        vuetify
      })
    })

    test('パスワードリセットメール送信ボタン', () => {
      // ボタンをクリック
      wrapper.find("[data-test='sendMailButton']").trigger('click')

      // メソッドが実行されたか
      expect(sendMail).toHaveBeenCalled()
    })
  })

  describe('リンク動作テスト', () => {
    let wrapper
    beforeEach(() => {
      wrapper = mount(PasswordReset, {
        localVue,
        store,
        router,
        vuetify
      })
    })

    test('トップボタンリンク', () => {
      // 正しいリンク先が設定されているか
      expect(wrapper.find("[data-test='topButtonLink']").props().to).toBe('/')
    })
  })
})
