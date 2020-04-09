export default function({ store, redirect }) {
  if (!store.state.auth.user) {
    redirect("/login")
  }
  store
    .dispatch("auth/checkAuth", "admin-higher")
    .then(result => {
      if (!store.getters["auth/getPermission"]("admin-higher")) {
        redirect("/")
      }
    })
    .catch(err => {
      redirect("/")
    })
}
