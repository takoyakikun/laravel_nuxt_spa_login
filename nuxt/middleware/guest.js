export default function({ store, redirect }) {
  if (store.getters["auth/userExists"]) {
    redirect("/")
  }
}
