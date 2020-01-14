export const state = () => ({
  user: null
})

export const mutations = {
  setUser(state, user) {
    state.user = user
  }
}

export const actions = {
  async login({ commit }, { email, password }) {
    await this.$axios
      .post("/api/login", { email, password })
      .then(response => {
        commit("setUser", response.data)
      })
      .catch(err => err.response)
  },
  async logout({ commit }) {
    await this.$axios
      .post("/api/logout")
      .then(response => {
        commit("setUser", null)
      })
      .catch(err => err.response)
  },
  async nuxtClientInit({ commit }) {
    await this.$axios
      .get("/api/user")
      .then(response => {
        commit("setUser", response.data)
      })
      .catch(err => err.response)
  }
}
