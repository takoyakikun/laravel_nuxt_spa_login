export const state = () => ({
  user: null,
  permission: {}
})

export const getters = {
  // アクセス許可を返す
  getPermission: (state, getters) => category => {
    if (getters.getPermissionExistence(category)) {
      return state.permission[category]
    } else {
      return false
    }
  },
  // アクセスデータが存在しているか
  getPermissionExistence: state => category => {
    return category in state.permission
  }
}

export const mutations = {
  // ユーザーデータをセット
  setUser(state, user) {
    state.user = user
  },

  // アクセス権限をセット
  setPermission(state, { category, permission }) {
    state.permission[category] = permission
  },

  // アクセス権限をリセット
  resetPermission(state) {
    state.permission = {}
  }
}

export const actions = {
  // ログイン
  async login({ commit }, { email, password, remember }) {
    return await this.$axios
      .post("/api/login", { email, password, remember })
      .then(res => {
        commit("setUser", res.data)
        return res
      })
      .catch(err => {
        return err.response
      })
  },

  // ログアウト
  async logout({ commit }) {
    return await this.$axios
      .post("/api/logout")
      .then(res => {
        commit("setUser", null)
        commit("resetPermission")
        return res
      })
      .catch(err => {
        return err.response
      })
  },

  // リロード時にユーザーデータを取得
  async nuxtClientInit({ commit }) {
    return await this.$axios
      .get("/api/user")
      .then(res => {
        commit("setUser", res.data)
        return res
      })
      .catch(err => {
        return err.response
      })
  },

  // アクセス権限をチェック
  async checkAuth({ commit, state, getters }, category) {
    let categories = []
    if (Array.isArray(category)) {
      categories = category
    } else {
      categories = [category]
    }
    for (let value of categories) {
      if (state.user && !getters.getPermissionExistence(value)) {
        await this.$axios
          .get("/api/permission/" + value)
          .then(res => {
            return res.data[0]
          })
          .catch(err => {
            return false
          })
          .then(result => {
            commit("setPermission", {
              category: value,
              permission: result
            })
          })
      }
    }
  }
}
