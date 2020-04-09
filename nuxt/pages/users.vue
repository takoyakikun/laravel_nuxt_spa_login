<template>
  <v-row align="center" justify="center">
    <v-col>
      <!-- ログインユーザー一覧 -->
      <c-user-list />
    </v-col>
  </v-row>
</template>

<script>
import CUserList from "~/components/users/userList"

export default {
  middleware: "admin",
  layout: "default",
  components: {
    CUserList
  },
  mounted() {
    this.$store.dispatch("users/getList")
  }
}
</script>
