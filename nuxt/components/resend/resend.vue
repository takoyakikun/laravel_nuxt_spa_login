<template>
  <v-card>
    <v-toolbar color="primary" dark flat>
      <v-toolbar-title>メールアドレスの認証</v-toolbar-title>
    </v-toolbar>
    <v-card-text>
      <v-alert v-show="resend" outlined type="success" text>
        新規認証メールを再送信しました。
      </v-alert>
      このページを閲覧するには、Eメールによる認証が必要です。<br />
      もし認証用のメールを受け取っていない場合、
      <a @click="resendMail()">こちらのリンク</a>
      をクリックして、認証メールを受け取ってください。
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      resend: false
    }
  },
  methods: {
    async resendMail() {
      this.$store.dispatch("users/resendMail").then(res => {
        this.resend = true
      })
    }
  }
}
</script>
