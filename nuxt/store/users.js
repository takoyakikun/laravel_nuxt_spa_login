export const state = () => ({
  list: []
})

export const getters = {
  list: state => state.list
}

export const mutations = {
  setList(state, list) {
    // ユーザーデータをセット
    state.list = list
  }
}

export const actions = {
  // データの取得
  async getList({ commit }) {
    return await this.$axios
      .get("/api/users")
      .then(res => {
        commit("setList", res.data)
        return res
      })
      .catch(err => err.response)
  },
  // 新規作成ページから新規ユーザー作成
  async registerData({ dispatch }, formValue) {
    return await this.$axios.post("/api/register", formValue).then(res => {
      return res
    })
  },
  // ユーザー管理から新規ユーザー作成
  async createData({ dispatch }, formValue) {
    return await this.$axios.post("/api/users", formValue).then(res => {
      dispatch("getList")
      return res
    })
  },
  // データ更新
  async editData({ dispatch, rootGetters }, { formValue, id }) {
    // id がある場合は指定したユーザーを変更、ない場合は自分のユーザーを変更
    if (id) {
      return await this.$axios
        .patch("/api/users/" + id, formValue)
        .then(res => {
          dispatch("getList")
          return res
        })
    } else {
      return await this.$axios
        .patch("/api/myuser/update", formValue)
        .then(res => {
          // 管理者権限以上は全ユーザーデータを再取得
          if (rootGetters["auth/permission"]("admin-higher")) {
            dispatch("getList")
          }
          return res
        })
    }
  },
  // データ削除
  async deleteData({ dispatch }, id) {
    return await this.$axios.delete("/api/users/" + id).then(res => {
      dispatch("getList")
      return res
    })
  },
  // パスワード変更
  async passwordChange({ dispatch }, formValue) {
    return await this.$axios
      .patch("/api/myuser/passwordChange", formValue)
      .then(res => {
        dispatch("getList")
        return res
      })
  }
}
