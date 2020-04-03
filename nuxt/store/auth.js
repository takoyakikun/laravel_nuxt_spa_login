export const state = () => ({
  user: null
})

export const mutations = {
  setUser(state, user) {
    state.user = user
  }
}

export const actions = {
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
  async logout({ commit }) {
    return await this.$axios
      .post("/api/logout")
      .then(res => {
        commit("setUser", null)
        return res
      })
      .catch(err => {
        return err.response
      })
  },
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
  }
}
