import { createLocalVue, shallowMount, mount } from "@vue/test-utils"
import Vuetify from "vuetify"
import Vuex from "vuex"
import axios from "axios"
import storeConfig from "@/test/storeConfig"
import setConfigData from "@/test/setConfigData"
import UserList from "@/components/users/userList"

const localVue = createLocalVue()
localVue.use(Vuex)

let vuetify = new Vuetify()

jest.useFakeTimers()

let store
beforeEach(() => {
  store = new Vuex.Store(storeConfig)
  store.commit("config/setConfig", setConfigData)
})

afterEach(() => {
  jest.clearAllMocks()
})

describe("components/users/userList", () => {
  describe("shallowMount", () => {
    let wrapper
    beforeEach(async () => {
      wrapper = shallowMount(UserList, {
        localVue,
        store,
        vuetify,
        sync: false
      })
    })

    test("is a Vue instance", () => {
      expect(wrapper.vm).toBeTruthy()
    })

    describe("編集不可のユーザー", () => {
      test("開発者権限", () => {
        // 権限を開発者にする
        wrapper.vm.$store.commit("auth/setPermission", {
          category: "system-only",
          permission: true
        })

        // 全てfalseを返す
        expect(wrapper.vm.editDisabled()).toBeFalsy()
      })

      describe("管理者権限", () => {
        beforeEach(() => {
          // 権限を管理者以上にする
          wrapper.vm.$store.commit("auth/setPermission", {
            category: "admin-higher",
            permission: true
          })
        })
        test("開発者ユーザー", () => {
          // 開発者ユーザーはtrueを返す
          const item = { role: 1 }
          expect(wrapper.vm.editDisabled(item)).toBeTruthy()
        })
        test("それ以外", () => {
          // それ以外はfalseを返す
          const item = { role: 5 }
          expect(wrapper.vm.editDisabled(item)).toBeFalsy()
        })
      })

      test("それ以外", () => {
        // 全てtrueを返す
        expect(wrapper.vm.editDisabled()).toBeTruthy()
      })
    })

    describe("削除不可のユーザー", () => {
      test("自ユーザー", () => {
        // ログインデータを登録
        wrapper.vm.$store.commit("auth/setUser", { id: 1 })

        // 権限を開発者にする
        wrapper.vm.$store.commit("auth/setPermission", {
          category: "system-only",
          permission: true
        })

        // 自ユーザーはtrueを返す
        const item = { id: 1 }
        expect(wrapper.vm.deleteDisabled(item)).toBeTruthy()
      })

      test("開発者権限", () => {
        // 権限を開発者にする
        wrapper.vm.$store.commit("auth/setPermission", {
          category: "system-only",
          permission: true
        })

        // 全てfalseを返す
        expect(wrapper.vm.deleteDisabled()).toBeFalsy()
      })

      describe("管理者権限", () => {
        beforeEach(() => {
          // 権限を管理者以上にする
          wrapper.vm.$store.commit("auth/setPermission", {
            category: "admin-higher",
            permission: true
          })
        })
        test("開発者ユーザー", () => {
          // 開発者ユーザーはtrueを返す
          const item = { role: 1 }
          expect(wrapper.vm.deleteDisabled(item)).toBeTruthy()
        })
        test("それ以外", () => {
          // それ以外はfalseを返す
          const item = { role: 5 }
          expect(wrapper.vm.deleteDisabled(item)).toBeFalsy()
        })
      })

      test("それ以外", () => {
        // 全てtrueを返す
        expect(wrapper.vm.deleteDisabled()).toBeTruthy()
      })
    })

    describe("自ユーザーかどうか", () => {
      beforeEach(() => {
        // ログインデータを登録
        wrapper.vm.$store.commit("auth/setUser", { id: 1 })
      })

      test("自ユーザー", () => {
        // 自ユーザーはtrueを返す
        wrapper.vm.editId = 1
        expect(wrapper.vm.myuser).toBeTruthy()
      })
      test("それ以外", () => {
        // それ以外はfalseを返す
        wrapper.vm.editId = 2
        expect(wrapper.vm.myuser).toBeFalsy()
      })
    })
  })

  describe("mount", () => {
    let wrapper
    beforeEach(async () => {
      wrapper = mount(UserList, {
        localVue,
        store,
        vuetify,
        sync: false
      })
    })

    describe("ユーザー追加", () => {
      let createFormValidate
      let axiosPost
      beforeEach(() => {
        // spyOn
        createFormValidate = jest.spyOn(wrapper.vm.$refs.createForm, "validate")
        axiosPost = jest.spyOn(axios, "post")

        // ダイアログを開く
        wrapper.vm.openCreateDialog()
      })

      describe("失敗", () => {
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

        test("フロント側エラー", async () => {
          // ユーザー追加処理
          await wrapper.vm.createSubmit()
          jest.runAllTimers()

          // バリデーションチェックをした
          expect(createFormValidate).toHaveBeenCalled()

          // バリデーションエラー
          expect(
            Object.keys(wrapper.vm.$refs.createForm.errors)
          ).not.toHaveLength(0)

          // API送信をしない
          expect(axiosPost).not.toHaveBeenCalled()
        })

        test("API側エラー", async () => {
          // フォームを入力してユーザー追加処理
          wrapper.find("input[name='name']").setValue("テスト")
          wrapper.find("input[name='email']").setValue("test@test.com")
          wrapper.find("input[name='role'][value='10']").setChecked()
          wrapper.find("input[name='password']").setValue("password")
          wrapper
            .find("input[name='password_confirmation']")
            .setValue("password")
          await wrapper.vm.createSubmit()
          jest.runAllTimers()

          // バリデーションチェックをした
          expect(createFormValidate).toHaveBeenCalled()

          // API送信をした
          expect(axiosPost).toHaveBeenCalled()
          expect(axiosPost).toHaveBeenCalledWith("/api/users", {
            name: "テスト",
            email: "test@test.com",
            role: 10,
            password: "password",
            password_confirmation: "password"
          })

          // snackbarのエラー表示
          expect(wrapper.vm.$store.getters["snackbar/text"]).toBe(
            "ユーザーデータの追加に失敗しました。"
          )
          expect(wrapper.vm.$store.getters["snackbar/options"].color).toBe(
            "error"
          )
        })
      })

      test("成功", async () => {
        // 正常なレスポンス
        const response = {
          status: 200
        }
        // axiosのレスポンスをモックする
        axios.post.mockImplementation(url => {
          return Promise.resolve(response)
        })
        wrapper.vm.$store.$axios = axios

        // フォームを入力してユーザー追加処理
        wrapper.find("input[name='name']").setValue("テスト")
        wrapper.find("input[name='email']").setValue("test@test.com")
        wrapper.find("input[name='role'][value='10']").setChecked()
        wrapper.find("input[name='password']").setValue("password")
        wrapper.find("input[name='password_confirmation']").setValue("password")
        await wrapper.vm.createSubmit()
        jest.runAllTimers()

        // バリデーションチェックをした
        expect(createFormValidate).toHaveBeenCalled()

        // API送信をした
        expect(axiosPost).toHaveBeenCalled()
        expect(axiosPost).toHaveBeenCalledWith("/api/users", {
          name: "テスト",
          email: "test@test.com",
          role: 10,
          password: "password",
          password_confirmation: "password"
        })

        // snackbarの完了表示
        expect(wrapper.vm.$store.getters["snackbar/text"]).toBe(
          "ユーザーデータを追加しました。"
        )
        expect(wrapper.vm.$store.getters["snackbar/options"].color).toBe(
          "success"
        )
      })
    })

    describe("ユーザー編集", () => {
      let editFormValidate
      let axiosPatch
      beforeEach(() => {
        // spyOn
        editFormValidate = jest.spyOn(wrapper.vm.$refs.editForm, "validate")
        axiosPatch = jest.spyOn(axios, "patch")

        // ダイアログを開く
        wrapper.vm.openEditDialog({
          id: 1,
          name: "テスト",
          email: "test@test.com",
          role: 10
        })
      })

      describe("失敗", () => {
        beforeEach(() => {
          // エラーレスポンス
          const response = {
            status: 422
          }
          // axiosのレスポンスをモックする
          axios.patch.mockImplementation(url => {
            return Promise.resolve(response)
          })
          wrapper.vm.$store.$axios = axios
        })

        test("フロント側エラー", async () => {
          // フォームを空にしてユーザー編集処理
          wrapper.find("input[name='name']").setValue("")
          wrapper.find("input[name='email']").setValue("")
          await wrapper.vm.editSubmit()
          jest.runAllTimers()

          // バリデーションチェックをした
          expect(editFormValidate).toHaveBeenCalled()

          // バリデーションエラー
          expect(
            Object.keys(wrapper.vm.$refs.editForm.errors)
          ).not.toHaveLength(0)

          // API送信をしない
          expect(axiosPatch).not.toHaveBeenCalled()
        })

        test("API側エラー", async () => {
          // フォームを入力してユーザー編集処理
          wrapper.find("input[name='name']").setValue("テスト")
          wrapper.find("input[name='email']").setValue("test@test.com")
          wrapper.find("input[name='role'][value='10']").setChecked()
          await wrapper.vm.editSubmit()
          jest.runAllTimers()

          // バリデーションチェックをした
          expect(editFormValidate).toHaveBeenCalled()

          // API送信をした
          expect(axiosPatch).toHaveBeenCalled()
          expect(axiosPatch).toHaveBeenCalledWith("/api/users/1", {
            id: 1,
            name: "テスト",
            email: "test@test.com",
            role: 10
          })

          // snackbarのエラー表示
          expect(wrapper.vm.$store.getters["snackbar/text"]).toBe(
            "ユーザーデータの更新に失敗しました。"
          )
          expect(wrapper.vm.$store.getters["snackbar/options"].color).toBe(
            "error"
          )
        })

        describe("成功", () => {
          beforeEach(() => {
            // 正常なレスポンス
            const response = {
              status: 200
            }
            // axiosのレスポンスをモックする
            axios.patch.mockImplementation(url => {
              return Promise.resolve(response)
            })
            wrapper.vm.$store.$axios = axios
          })

          test("自ユーザー", async () => {
            // ログインデータを登録
            wrapper.vm.$store.commit("auth/setUser", { id: 1 })

            // フォームを入力してユーザー編集処理
            wrapper.find("input[name='name']").setValue("テスト")
            wrapper.find("input[name='email']").setValue("test@test.com")
            wrapper.find("input[name='role'][value='10']").setChecked()
            await wrapper.vm.editSubmit()
            jest.runAllTimers()

            // バリデーションチェックをした
            expect(editFormValidate).toHaveBeenCalled()

            // API送信をした
            expect(axiosPatch).toHaveBeenCalled()
            expect(axiosPatch).toHaveBeenCalledWith("/api/myuser/update", {
              id: 1,
              name: "テスト",
              email: "test@test.com",
              role: 10
            })

            // snackbarの完了表示
            expect(wrapper.vm.$store.getters["snackbar/text"]).toBe(
              "ユーザーデータを更新しました。"
            )
            expect(wrapper.vm.$store.getters["snackbar/options"].color).toBe(
              "success"
            )
          })

          test("それ以外", async () => {
            // フォームを入力してユーザー編集処理
            wrapper.find("input[name='name']").setValue("テスト")
            wrapper.find("input[name='email']").setValue("test@test.com")
            wrapper.find("input[name='role'][value='10']").setChecked()
            await wrapper.vm.editSubmit()
            jest.runAllTimers()

            // バリデーションチェックをした
            expect(editFormValidate).toHaveBeenCalled()

            // API送信をした
            expect(axiosPatch).toHaveBeenCalled()
            expect(axiosPatch).toHaveBeenCalledWith("/api/users/1", {
              id: 1,
              name: "テスト",
              email: "test@test.com",
              role: 10
            })

            // snackbarの完了表示
            expect(wrapper.vm.$store.getters["snackbar/text"]).toBe(
              "ユーザーデータを更新しました。"
            )
            expect(wrapper.vm.$store.getters["snackbar/options"].color).toBe(
              "success"
            )
          })
        })
      })
    })

    describe("ユーザー削除", () => {
      let axiosDelete
      beforeEach(() => {
        // spyOn
        axiosDelete = jest.spyOn(axios, "delete")

        // ダイアログを開く
        wrapper.vm.openDeleteDialog({
          id: 1,
          name: "テスト",
          email: "test@test.com",
          role: 10
        })
      })

      test("失敗", async () => {
        // エラーレスポンス
        const response = {
          status: 422
        }
        // axiosのレスポンスをモックする
        axios.delete.mockImplementation(url => {
          return Promise.resolve(response)
        })
        wrapper.vm.$store.$axios = axios

        // ユーザー削除処理
        await wrapper.vm.deleteSubmit()

        // API送信をした
        expect(axiosDelete).toHaveBeenCalled()
        expect(axiosDelete).toHaveBeenCalledWith("/api/users/1")

        // snackbarのエラー表示
        expect(wrapper.vm.$store.getters["snackbar/text"]).toBe(
          "ユーザーデータの削除に失敗しました。"
        )
        expect(wrapper.vm.$store.getters["snackbar/options"].color).toBe(
          "error"
        )
      })

      test("ユーザー削除成功", async () => {
        // 正常なレスポンス
        const response = {
          status: 200
        }
        // axiosのレスポンスをモックする
        axios.delete.mockImplementation(url => {
          return Promise.resolve(response)
        })
        wrapper.vm.$store.$axios = axios

        // ユーザー削除処理
        await wrapper.vm.deleteSubmit()

        // API送信をした
        expect(axiosDelete).toHaveBeenCalled()
        expect(axiosDelete).toHaveBeenCalledWith("/api/users/1")

        // snackbarの完了表示
        expect(wrapper.vm.$store.getters["snackbar/text"]).toBe(
          "ユーザーデータを削除しました。"
        )
        expect(wrapper.vm.$store.getters["snackbar/options"].color).toBe(
          "success"
        )
      })
    })
  })
})
