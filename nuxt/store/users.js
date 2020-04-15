export const state = () => ({
  list: []
})

export const getters = {}

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
  // データ修正
  async editData({ dispatch }, { formValue, id }) {
    return await this.$axios.patch("/api/users/" + id, formValue).then(res => {
      dispatch("getList")
      return res
    })
  },
  // データ削除
  async deleteData({ dispatch }, id) {
    return await this.$axios.delete("/api/users/" + id).then(res => {
      dispatch("getList")
      return res
    })
  },
  // パスワード変更
  async passwordChange({ dispatch }, { formValue, id }) {
    if (id) {
      return await this.$axios
        .patch("/api/users/passwordChange/" + id, formValue)
        .then(res => {
          dispatch("getList")
          return res
        })
    } else {
      return await this.$axios
        .patch("/api/users/passwordChange", formValue)
        .then(res => {
          dispatch("getList")
          return res
        })
    }
  }
}
