<template>
  <v-app id="inspire">
    <!-- サイドバー -->
    <v-navigation-drawer v-model="drawer" app>
      <v-list dense>
        <!-- Topページ -->
        <v-list-item link to="/">
          <v-list-item-action>
            <v-icon>mdi-home</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Top</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <!-- 認証済ページ -->
        <v-list-item v-if="$store.state.auth.user" link to="auth">
          <v-list-item-action>
            <v-icon>mdi-lock</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Auth</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <!-- ユーザー管理 -->
        <v-list-item v-if="getPermission('admin-higher')" link to="users">
          <v-list-item-action>
            <v-icon>mdi-account-group</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Users</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- ヘッダー -->
    <v-app-bar app color="indigo" dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>Application</v-toolbar-title>
      <v-spacer />
      <v-btn v-if="$store.state.auth.user" outlined @click="logout">
        <v-icon left>
          mdi-logout-variant
        </v-icon>
        Logout
      </v-btn>
      <v-btn v-if="!$store.state.auth.user" outlined to="login">
        <v-icon left>
          mdi-login-variant
        </v-icon>
        Login
      </v-btn>
    </v-app-bar>

    <!-- メインコンテンツ -->
    <v-content>
      <v-container class="fill-height" fluid>
        <nuxt />
      </v-container>
    </v-content>

    <!-- フッター -->
    <v-footer color="indigo" app>
      <span class="white--text">&copy; 2019</span>
    </v-footer>

    <!-- snackbar -->
    <v-snackbar v-model="snackbar.snackbar" :color="snackbar.color">
      {{ snackbar.text }}
    </v-snackbar>
  </v-app>
</template>

<script>
import { mapGetters, mapActions } from "vuex"

export default {
  data: () => ({
    drawer: false
  }),
  computed: {
    ...mapGetters({
      getPermission: "auth/getPermission"
    }),

    // snackbarの状態をstoreと同期させる
    snackbar: {
      get() {
        return this.$store.state.snackbar
      },
      set(val) {
        this.$store.commit("snackbar/setSnackbar", val)
      }
    }
  },
  mounted() {
    this.$store.dispatch("auth/checkAuth", "admin-higher")
  },
  methods: {
    ...mapActions("snackbar", ["openSnackbar"]),

    async logout() {
      await this.$store.dispatch("auth/logout")

      this.$router.push("/")
    }
  }
}
</script>
