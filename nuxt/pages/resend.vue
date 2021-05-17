<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <Resend />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Resend from '~/components/resend/resend'

export default {
  name: 'ResendPage',
  middleware: 'noVerified',
  layout: 'login',
  components: {
    Resend
  },
  head() {
    return {
      title: 'メールアドレスの認証'
    }
  }
}
</script>
