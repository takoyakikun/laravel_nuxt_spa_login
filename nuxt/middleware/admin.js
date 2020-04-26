export default async function({ store, redirect }) {
  if (!store.getters["auth/userExists"]) {
    redirect("/login")
  }
  await store.dispatch("auth/checkAuth", "admin-higher")

  if (!store.getters["auth/permission"]("admin-higher")) {
    redirect("/")
  }
}
