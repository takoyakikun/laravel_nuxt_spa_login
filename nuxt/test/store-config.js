const stores = require.context("../store", true, /\.js$/)
const modules = {}
stores.keys().forEach(key => {
  const store = stores(key)
  modules[key.replace(/^\.\//, "").replace(/\.\w+$/, "")] = {
    namespaced: true,
    state: store.state,
    getters: store.getters,
    mutations: store.mutations
  }
})

export default {
  modules
}
