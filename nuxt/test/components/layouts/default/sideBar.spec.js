import { createLocalVue, shallowMount } from "@vue/test-utils"
import Vuetify from "vuetify"
import Vuex from "vuex"
import storeConfig from "@/test/storeConfig"
import setConfigData from "@/test/setConfigData"
import SideBar from "@/components/layouts/default/sideBar"

const localVue = createLocalVue()
localVue.use(Vuex)

let vuetify = new Vuetify()

let store
beforeEach(() => {
  store = new Vuex.Store(storeConfig)
  store.commit("config/setConfig", setConfigData)
})

afterEach(() => {
  jest.clearAllMocks()
})

describe("components/layouts/default/sideBar", () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallowMount(SideBar, {
      localVue,
      store,
      vuetify,
      sync: false,
      propsData: {
        value: false
      }
    })
  })

  test("is a Vue instance", () => {
    expect(wrapper.vm).toBeTruthy()
  })
})
