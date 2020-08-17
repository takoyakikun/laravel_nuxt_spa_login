<template>
  <v-row align="center" justify="center">
    <v-col>
      <!-- ログインユーザー一覧 -->
      <UserList />
    </v-col>
  </v-row>
</template>

<script>
import UserList from "~/components/users/userList"

export default {
  middleware: "admin",
  layout: "default",
  components: {
    UserList
  },
  async created() {
    await this.$store.dispatch("auth/checkAuth", "system-only")
    this.$store.dispatch("users/setList")
  }
}
</script>
