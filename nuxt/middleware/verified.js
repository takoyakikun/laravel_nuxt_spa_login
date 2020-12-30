export default async function({ store, redirect, app }) {
  // アクセス権限をAPIから取得してストアにセット
  await app.$api.auth.checkAuth("verified")

  // ログイン中でメール認証済でない場合は認証メール再送信ページへリダイレクト
  if (
    store.getters["auth/userExists"] &&
    !store.getters["auth/permission"]("verified")
  ) {
    return redirect("/resend")
  }
}
