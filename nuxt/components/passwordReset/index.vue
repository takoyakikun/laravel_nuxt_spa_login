<template>
  <div>
    <ValidationObserver ref="sendMailValidate" v-slot="{ invalid }">
      <v-card>
        <v-toolbar color="primary" dark flat>
          <v-toolbar-title>パスワードリセット</v-toolbar-title>
        </v-toolbar>

        <v-card-text>
          <v-alert v-show="send" outlined type="success" text>
            パスワードリセットメールを送信しました。
          </v-alert>
          <SendMailForm v-model="formValue" @submit="sendMail" />
        </v-card-text>

        <v-card-actions>
          <v-btn data-test="topButtonLink" to="/">
            <v-icon left>
              mdi-home
            </v-icon>
            Top
          </v-btn>
          <v-spacer />
          <v-btn
            data-test="sendMailButton"
            :disabled="invalid"
            :loading="loading"
            color="primary"
            @click="sendMail"
          >
            <v-icon left>
              mdi-email-send-outline
            </v-icon>
            パスワードリセットメール送信
          </v-btn>
        </v-card-actions>
      </v-card>
    </ValidationObserver>
  </div>
</template>

<script>
import SendMailForm from '~/components/passwordReset/sendMailForm'

export default {
  name: 'PasswordResetIndexComponent',
  components: {
    SendMailForm
  },
  data() {
    return {
      send: false,
      loading: false,
      formValue: {}
    }
  },
  methods: {
    // パスワードリセットメールを送信
    async sendMail() {
      if (!this.loading) {
        this.loading = true
        await this.$refs.sendMailValidate.validate().then(async result => {
          if (result) {
            await this.$api.users
              .passwordResetMail(this.formValue)
              .then(res => {
                if (res.status === 200) {
                  this.send = true
                } else {
                  this.$snackbar.openSnackbar({
                    text: 'パスワードリセットメール送信に失敗しました。',
                    options: { color: 'error' }
                  })
                }
              })
          }
        })
        this.loading = false
      }
    }
  }
}
</script>
