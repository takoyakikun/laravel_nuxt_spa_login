<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <PasswordReset />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import PasswordReset from '~/components/passwordReset/index'

export default {
  name: 'PasswordResetIndexPage',
  middleware: 'guest',
  layout: 'login',
  components: {
    PasswordReset
  },
  head() {
    return {
      title: 'パスワードリセット'
    }
  }
}
</script>
