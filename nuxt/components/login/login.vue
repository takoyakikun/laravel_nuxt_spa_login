<template>
  <div>
    <ValidationObserver ref="validate">
      <v-card class="elevation-12">
        <v-app-bar dark flat color="primary" class="headline">
          <span>ログイン</span>
          <v-spacer />
        </v-app-bar>

        <v-card-text>
          <LoginForm :value="state.formValue" @submit="submit" />
          <nuxt-link
            data-test="passwordResetLink"
            to="passwordReset"
            @click.native="$router.push('passwordReset')"
          >
            パスワードを忘れた方はこちら
          </nuxt-link>
        </v-card-text>

        <v-card-actions>
          <v-btn data-test="topButtonLink" to="/">
            <v-icon left>
              mdi-home
            </v-icon>
            トップ
          </v-btn>
          <v-spacer />
          <v-btn
            data-test="loginButton"
            :loading="state.loading"
            color="primary"
            @click="submit"
          >
            <v-icon left>
              mdi-login-variant
            </v-icon>
            ログイン
          </v-btn>
        </v-card-actions>
      </v-card>
    </ValidationObserver>
  </div>
</template>

<script>
import {
  defineComponent,
  reactive,
  useContext,
  onMounted
} from '@nuxtjs/composition-api'
import LoginForm from '~/components/login/loginForm'

export default defineComponent({
  name: 'LoginComponent',
  components: {
    LoginForm
  },
  setup(_, context) {
    const { app } = useContext()

    const state = reactive({
      formValue: {},
      validate: {},
      loading: false
    })

    // フォームを送信
    const submit = async () => {
      if (!state.loading) {
        try {
          state.loading = true
          await state.validate.validate().then(async result => {
            if (result) {
              const res = await app.$axios
                .post(`/api/login`, state.formValue)
                .then(res => res)
                .catch(err => err.response)

              if (res.status === 200) {
                // リロード
                location.reload()
              } else {
                // エラーメッセージとフォーム入力データをローカルストレージに保存してリロード
                localStorage.setItem(
                  'snacbar',
                  JSON.stringify({
                    text: '認証に失敗しました。',
                    options: { color: 'error' }
                  })
                )
                localStorage.setItem(
                  'loginFormValue',
                  JSON.stringify({
                    login_id: state.formValue.login_id,
                    remember: state.formValue.remember
                  })
                )
                location.reload()
              }
            }
          })
        } finally {
          state.loading = false
        }
      }
    }

    onMounted(() => {
      // バリデーションデータをセット
      state.validate = context.refs.validate
    })

    return {
      state,
      submit
    }
  }
})
</script>
