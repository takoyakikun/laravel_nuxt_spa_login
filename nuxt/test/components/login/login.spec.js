import { shallowMount, mount, RouterLinkStub } from '@vue/test-utils'
import { localVue, router, vuetify } from '~/test/setLocalVue'
import axios from 'axios'
import setStore from '~/test/setStore'
import setApi from '~/test/setApi'
import setPlugin from '~/test/setPlugin'
import * as types from '~/store/mutation-types'
import setConfigData from '~/test/setConfigData'
import setLocation from '~/test/setLocation'
import setLocalStorage from '~/test/setLocalStorage'
import Component from '~/components/login/login'

jest.useFakeTimers()
jest.mock('vuex')
jest.mock('axios')

setLocation()
setLocalStorage()

let store
beforeEach(() => {
  store = setStore(localVue)
  setApi(localVue, axios, store)
  setPlugin(localVue)
  store.commit('config/' + types.CONFIG_SET_CONFIG, setConfigData)
  localStorage.clear()
  localVue.prototype.$nuxt.context.app.$axios = axios
})

afterEach(() => {
  jest.clearAllMocks()
})

describe(__filename, () => {
  let mountOptions
  beforeEach(() => {
    mountOptions = {
      localVue,
      store,
      router,
      vuetify,
      stubs: {
        NuxtLink: RouterLinkStub
      }
    }
  })

  test('is a Vue instance', () => {
    const wrapper = shallowMount(Component, mountOptions)

    expect(wrapper.vm).toBeTruthy()
  })

  describe('フォーム動作テスト', () => {
    beforeEach(() => {
      router.push = jest.fn()
    })

    describe('ログイン', () => {
      let axiosPost
      beforeEach(() => {
        // spyOn
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
        })

        test('フロント側エラー', async () => {
          const wrapper = mount(Component, mountOptions)

          // spyOn
          const loginFormValidation = jest.spyOn(
            wrapper.vm.state.validate,
            'validate'
          )

          // ログイン処理
          await wrapper.vm.submit()
          jest.runAllTimers()
          await wrapper.vm.$nextTick()

          // バリデーションチェックをした
          expect(loginFormValidation).toHaveBeenCalled()

          // バリデーションエラー
          expect(
            Object.keys(wrapper.vm.state.validate.errors)
          ).not.toHaveLength(0)

          // API送信をしない
          expect(axiosPost).not.toHaveBeenCalled()
        })

        test('API側エラー', async () => {
          const wrapper = mount(Component, mountOptions)

          // spyOn
          const loginFormValidation = jest.spyOn(
            wrapper.vm.state.validate,
            'validate'
          )
          const reload = jest.spyOn(window.location, 'reload')

          // フォームを入力してログイン処理
          wrapper.find("input[name='login_id']").setValue('test@test.com')
          wrapper.find("input[name='password']").setValue('password')
          await wrapper.vm.submit()
          jest.runAllTimers()
          await wrapper.vm.$nextTick()

          // バリデーションチェックをした
          expect(loginFormValidation).toHaveBeenCalled()

          // API送信をした
          expect(axiosPost).toHaveBeenCalled()
          expect(axiosPost).toHaveBeenCalledWith('/api/login', {
            login_id: 'test@test.com',
            password: 'password'
          })

          // リロードした
          expect(reload).toHaveBeenCalled()

          // ローカルストレージにsnackbarのデータがある
          expect(localStorage.getItem('snacbar')).toBe(
            JSON.stringify({
              text: '認証に失敗しました。',
              options: { color: 'error' }
            })
          )

          // ローカルストレージにフォーム入力データがある
          expect(localStorage.getItem('loginFormValue')).toBe(
            JSON.stringify({
              login_id: 'test@test.com'
            })
          )
        })
      })

      test('成功', async () => {
        const wrapper = mount(Component, mountOptions)

        // spyOn
        const routerPush = jest.spyOn(wrapper.vm.$router, 'push')
        const loginFormValidation = jest.spyOn(
          wrapper.vm.state.validate,
          'validate'
        )
        const reload = jest.spyOn(window.location, 'reload')

        // 正常なレスポンス
        const response = {
          status: 200
        }
        // axiosのレスポンスをモックする
        axios.post.mockImplementation(url => {
          return Promise.resolve(response)
        })

        // フォームを入力してログイン処理
        wrapper.find("input[name='login_id']").setValue('test@test.com')
        wrapper.find("input[name='password']").setValue('password')
        await wrapper.vm.submit()
        jest.runAllTimers()
        await wrapper.vm.$nextTick()

        // バリデーションチェックをした
        expect(loginFormValidation).toHaveBeenCalled()

        // API送信をした
        expect(axiosPost).toHaveBeenCalled()
        expect(axiosPost).toHaveBeenCalledWith('/api/login', {
          login_id: 'test@test.com',
          password: 'password'
        })

        // リロードした
        expect(reload).toHaveBeenCalled()
      })

      test('loading中はログイン処理不可', async () => {
        const wrapper = mount(Component, mountOptions)

        // spyOn
        const loginFormValidation = jest.spyOn(
          wrapper.vm.state.validate,
          'validate'
        )

        // loading中の設定
        wrapper.vm.state.loading = true

        // ログイン処理
        await wrapper.vm.submit()
        jest.runAllTimers()
        await wrapper.vm.$nextTick()

        // バリデーションチェックをしない
        expect(loginFormValidation).not.toHaveBeenCalled()
      })
    })
  })
})
