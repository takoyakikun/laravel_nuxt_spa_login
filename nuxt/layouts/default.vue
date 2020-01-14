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
      </v-list>
    </v-navigation-drawer>

    <!-- ヘッダー -->
    <v-app-bar app color="indigo" dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>Application</v-toolbar-title>
      <v-spacer />
      <v-btn v-if="$store.state.auth.user" color="primary" @click="logout">
        <v-icon left>
          mdi-logout-variant
        </v-icon>
        Logout
      </v-btn>
      <v-btn v-if="!$store.state.auth.user" color="primary" to="login">
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
  </v-app>
</template>

<script>
export default {
  data: () => ({
    drawer: false
  }),
  methods: {
    async logout() {
      await this.$store.dispatch("auth/logout")

      this.$router.push("/")
    }
  }
}
</script>
