export default async function({ store, redirect, app }) {
  // ユーザーがログインしていない場合はログインページへリダイレクト
  if (!store.getters["auth/userExists"]) {
    return redirect("/login")
  }

  // アクセス権限をAPIから取得してストアにセット
  await app.$api.auth.checkAuth(["admin-higher", "verified"])

  // 管理者以上でない場合はTopページへリダイレクト
  if (!store.getters["auth/permission"]("admin-higher")) {
    return redirect("/")
  }
  // メール認証済でない場合は認証メール再送信ページへリダイレクト
  if (!store.getters["auth/permission"]("verified")) {
    return redirect("/resend")
  }
}
