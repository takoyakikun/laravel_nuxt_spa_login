export const state = () => ({
  snackbar: false,
  color: "",
  text: ""
})

export const mutations = {
  // ダイアログの表示/非表示をセット
  setSnackbar(state, snackbar) {
    state.snackbar = true
    state.color = snackbar.color
    state.text = snackbar.text
  }
}

export const actions = {
  // ダイアログを開く
  openSnackbar({ commit }, snackbar) {
    commit("setSnackbar", snackbar)
  }
}
