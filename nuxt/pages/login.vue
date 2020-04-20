<template>
  <v-row align="center" justify="center">
    <v-col cols="12" sm="8" md="4">
      <validation-observer ref="loginForm" v-slot="{ invalid }">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Login form</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <c-login-form :form-value.sync="loginForm" @submit="submit" />
          </v-card-text>
          <v-card-actions>
            <v-btn :disabled="invalid" color="primary" @click="submit">
              <v-icon left>
                mdi-login-variant
              </v-icon>
              Login
            </v-btn>
            <v-spacer />
            <v-btn to="/">
              <v-icon left>
                mdi-home
              </v-icon>
              Top
            </v-btn>
          </v-card-actions>
        </v-card>
      </validation-observer>
    </v-col>
  </v-row>
</template>

<script>
import { mapActions } from "vuex"
import CLoginForm from "~/components/login/loginForm"

export default {
  middleware: "guest",
  layout: "login",
  components: {
    CLoginForm
  },
  data() {
    return {
      loginForm: {
        email: "",
        password: "",
        remember: false
      }
    }
  },
  methods: {
    ...mapActions("snackbar", ["openSnackbar"]),

    async submit() {
      // ログイン処理
      await this.$refs.loginForm.validate().then(result => {
        if (result) {
          this.$store
            .dispatch("auth/login", {
              email: this.loginForm.email,
              password: this.loginForm.password,
              remember: this.loginForm.remember
            })
            .then(res => {
              if (res.status === 200) {
                this.$router.push("/")
              } else {
                this.loginForm.password = ""
                this.$refs.loginForm.reset()
                this.openSnackbar({
                  text: "認証に失敗しました。",
                  color: "error"
                })
              }
            })
        }
      })
    }
  }
}
</script>
