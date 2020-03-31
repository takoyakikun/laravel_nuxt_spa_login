<template>
  <v-row align="center" justify="center">
    <v-col cols="12" sm="8" md="4">
      <v-card class="elevation-12">
        <v-toolbar color="primary" dark flat>
          <v-toolbar-title>Login form</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-form>
            <v-text-field
              v-model="email"
              label="Login"
              name="login"
              prepend-icon="mdi-account"
              type="text"
              @keydown.enter="submit"
            />

            <v-text-field
              id="password"
              v-model="password"
              label="Password"
              name="password"
              prepend-icon="mdi-lock"
              type="password"
              @keydown.enter="submit"
            />

            <v-checkbox
              v-model="remember"
              color="primary"
              label="Remember me"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn to="/">
            <v-icon left>
              mdi-home
            </v-icon>
            Top
          </v-btn>
          <v-spacer />
          <v-btn color="primary" @click="submit">
            <v-icon left>
              mdi-login-variant
            </v-icon>
            Login
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  middleware: "guest",
  layout: "login",
  data() {
    return {
      email: "",
      password: "",
      remember: false
    }
  },
  methods: {
    async submit(event) {
      // 日本語入力時のEnterキーの反応を防ぐ
      if (event.keyCode && event.keyCode !== 13) return

      // ログイン処理
      await this.$store.dispatch("auth/login", {
        email: this.email,
        password: this.password,
        remember: this.remember
      })

      this.$router.push("/")
    }
  }
}
</script>
