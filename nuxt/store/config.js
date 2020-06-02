export const state = () => ({
  data: {}
})

export const getters = {
  // コンフィグからテキストを取得
  getConfigText: state => (name, value) => {
    const data = state.data[name].find(item => item.value === value)
    if (data) {
      return data.text
    } else {
      return ""
    }
  }
}

export const mutations = {
  // コンフィグデータをセット
  setConfig(state, config) {
    state.data = { ...state.data, ...config }
  }
}

export const actions = {
  // APIサーバから取得したコンフィグデータをセットする
  async setConfig({ commit }) {
    return await this.$axios
      .get("/api/config")
      .then(res => {
        commit("setConfig", res.data)
        return res
      })
      .catch(e => e.response)
  }
}
