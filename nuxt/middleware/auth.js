export default async function({ store, redirect, app }) {
  // ユーザーがログインしていない場合はログインページへリダイレクト
  if (!store.getters['auth/userExists']) {
    return redirect('/login')
  }

  // アクセス権限をAPIから取得してストアにセット
  await app.$api.auth.checkAuth('verified')

  // メール認証済でない場合は認証メール再送信ページへリダイレクト
  if (!store.getters['auth/permission']('verified')) {
    return redirect('/resend')
  }
}
