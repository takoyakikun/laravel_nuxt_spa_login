export default async function({ store, redirect }) {
  await store.dispatch("auth/checkAuth", "verified")

  // メール認証済でない場合は認証メール再送信ページへリダイレクト
  if (!store.getters["auth/permission"]("verified")) {
    redirect("/resend")
  }
}
