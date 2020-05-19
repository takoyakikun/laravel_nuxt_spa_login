<template>
  <v-row align="center" justify="center">
    <v-col cols="12" sm="8" md="4">
      <validation-observer ref="registerForm" v-slot="{ invalid }">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>新規ユーザー作成</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <UserForm
              v-model="registerFormValue"
              form-type="create"
              myuser
              @submit="submit"
            />
          </v-card-text>
          <v-card-actions>
            <v-btn :disabled="invalid" color="primary" @click="submit">
              <v-icon left>
                mdi-account-plus
              </v-icon>
              新規作成
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
import UserForm from "~/components/users/userForm"

export default {
  middleware: "guest",
  layout: "login",
  components: {
    UserForm
  },
  data() {
    return {
      registerFormValue: {
        email: "",
        password: "",
        remember: false
      }
    }
  },
  methods: {
    ...mapActions("users", ["registerData"]),
    ...mapActions("snackbar", ["openSnackbar"]),

    async submit(event) {
      await this.$refs.registerForm.validate().then(result => {
        if (result) {
          this.registerData(this.registerFormValue)
            .then(res => {
              this.$store
                .dispatch("auth/login", {
                  email: this.registerFormValue.email,
                  password: this.registerFormValue.password
                })
                .then(res => {
                  this.$router.push("/")
                })
            })
            .catch(e => {
              this.openSnackbar({
                text: "ユーザーデータの追加に失敗しました。",
                options: { color: "error" }
              })
            })
        }
      })
    }
  }
}
</script>
