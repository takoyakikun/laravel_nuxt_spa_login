import { shallowMount } from "@vue/test-utils"
import Vuetify from "vuetify"
import Vuex from "vuex"
import storeConfig from "@/test/storeConfig"
import Auth from "@/pages/auth"
import Login from "@/pages/login"
import Register from "@/pages/register"
import Resend from "@/pages/resend"
import Users from "@/pages/users"
import PasswordReset from "@/pages/passwordReset/index"
import PasswordResetToken from "@/pages/passwordReset/_token"

let store = new Vuex.Store(storeConfig)
let vuetify = new Vuetify()

describe("auth", () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallowMount(Auth, { store, vuetify })
  })

  test("is a Vue instance", () => {
    expect(wrapper.vm).toBeTruthy()
  })
})

describe("login", () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallowMount(Login, { store, vuetify })
  })

  test("is a Vue instance", () => {
    expect(wrapper.vm).toBeTruthy()
  })
})

describe("register", () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallowMount(Register, { store, vuetify })
  })

  test("is a Vue instance", () => {
    expect(wrapper.vm).toBeTruthy()
  })
})

describe("resend", () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallowMount(Resend, { store, vuetify })
  })

  test("is a Vue instance", () => {
    expect(wrapper.vm).toBeTruthy()
  })
})

describe("users", () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallowMount(Users, { store, vuetify })
  })

  test("is a Vue instance", () => {
    expect(wrapper.vm).toBeTruthy()
  })
})

describe("passwordReset", () => {
  describe("index", () => {
    let wrapper
    beforeEach(() => {
      wrapper = shallowMount(PasswordReset, { store, vuetify })
    })

    test("is a Vue instance", () => {
      expect(wrapper.vm).toBeTruthy()
    })
  })

  describe("_token", () => {
    let wrapper
    beforeEach(() => {
      wrapper = shallowMount(PasswordResetToken, { store, vuetify })
    })

    test("is a Vue instance", () => {
      expect(wrapper.vm).toBeTruthy()
    })
  })
})
