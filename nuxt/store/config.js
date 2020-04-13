export const state = () => ({
  data: {
    role: [
      { value: 1, text: "開発者" },
      { value: 5, text: "管理者" },
      { value: 10, text: "一般" }
    ]
  }
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
