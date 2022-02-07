import { shallowMount } from '@vue/test-utils'
import { localVue, vuetify } from '~/test/setLocalVue'
import axios from 'axios'
import setStore from '~/test/setStore'
import setApi from '~/test/setApi'
import setPlugin from '~/test/setPlugin'
import setLocalStorage from '~/test/setLocalStorage'
import Snackbar from '~/components/snackbar/snackbar'

jest.useFakeTimers()
jest.mock('vuex')
jest.mock('axios')

setLocalStorage()

let store
beforeEach(() => {
  store = setStore(localVue)
  setApi(localVue, axios, store)
  setPlugin(localVue)
  localStorage.clear()
  localVue.prototype.$nuxt.context.app.$axios = axios
})

afterEach(() => {
  jest.clearAllMocks()
})

describe(__filename, () => {
  let wrapper
  let mountOptions
  beforeEach(() => {
    mountOptions = {
      localVue,
      store,
      vuetify
    }
  })

  test('is a Vue instance', () => {
    wrapper = shallowMount(Snackbar, mountOptions)
    expect(wrapper.vm).toBeTruthy()
  })

  test('snackbarを表示する', () => {
    wrapper = shallowMount(Snackbar, mountOptions)

    // snackbarを開く処理
    wrapper.vm.snackbar.openSnackbar({
      text: 'テスト',
      options: { color: 'success' }
    })

    // snackbarが開いているか
    expect(wrapper.vm.snackbar.value).toBeTruthy()

    // snackbarに指定したテキストが表示されているか
    expect(wrapper.vm.snackbar.text).toBe('テスト')

    // snackbarが指定した色で表示されているか
    expect(wrapper.vm.snackbar.options.color).toBe('success')
  })

  test('ローカルストレージからsnackbarを表示する', () => {
    // ローカルストレージにデータを追加
    const testData = {
      text: 'テスト',
      options: { color: 'success' }
    }
    localStorage.setItem('snacbar', JSON.stringify(testData))

    wrapper = shallowMount(Snackbar, mountOptions)

    // snackbarが開いているか
    expect(wrapper.vm.snackbar.value).toBeTruthy()

    // snackbarに指定したテキストが表示されているか
    expect(wrapper.vm.snackbar.text).toBe('テスト')

    // snackbarが指定した色で表示されているか
    expect(wrapper.vm.snackbar.options.color).toBe('success')

    // ローカルストレージからデータが削除されている
    expect(localStorage.getItem('snacbar')).toBe('')
  })
})
