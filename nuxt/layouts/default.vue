<template>
  <v-app id="inspire">
    <!-- サイドバー -->
    <SideBar v-model="drawer" />

    <!-- ヘッダー -->
    <Header :drawer="drawer" @drawer="setDrawer" />

    <!-- メインコンテンツ -->
    <v-content>
      <v-container class="fill-height" fluid>
        <nuxt />
      </v-container>
    </v-content>

    <!-- フッター -->
    <Footer />

    <!-- 編集ダイアログ -->
    <validation-observer ref="editFormValidate" v-slot="{ invalid }">
      <MyDialog
        ref="editDialog"
        v-model="editDialog"
        name="myuserEdit"
        title="ユーザー編集"
        color="primary"
        :options="{ persistent: true }"
      >
        <template #content>
          <UserForm
            v-model="editFormValue"
            form-type="edit"
            myuser
            @submit="editSubmit"
          />
        </template>

        <template #actions="{ color }">
          <v-btn :disabled="invalid" :color="color" @click="editSubmit">
            <v-icon left>
              mdi-account-edit
            </v-icon>
            更新
          </v-btn>
          <v-spacer />
        </template>
      </MyDialog>
    </validation-observer>

    <!-- パスワード変更ダイアログ -->
    <validation-observer ref="passwordChangeFormValidate" v-slot="{ invalid }">
      <MyDialog
        ref="passwordChangeDialog"
        v-model="passwordChangeDialog"
        name="passwordChange"
        title="パスワード変更"
        color="primary"
        :options="{ persistent: true }"
      >
        <template #content>
          <PasswordChangeForm
            v-model="passwordChangeFormValue"
            @submit="passwordChangeSubmit"
          />
        </template>

        <template #actions="{ color }">
          <v-btn
            :disabled="invalid"
            :color="color"
            @click="passwordChangeSubmit"
          >
            <v-icon left>
              mdi-lock
            </v-icon>
            変更
          </v-btn>
          <v-spacer />
        </template>
      </MyDialog>
    </validation-observer>

    <!-- トップスクロールボタン -->
    <TopScroll />

    <!-- snackbar -->
    <Snackbar />
  </v-app>
</template>

<script>
import { mapGetters } from "vuex"
import TopScroll from "~/components/topScroll/topScroll"
import Snackbar from "~/components/snackbar/snackbar"
import SideBar from "~/components/layouts/default/sideBar"
import Header from "~/components/layouts/default/header"
import Footer from "~/components/layouts/default/footer"

export default {
  components: {
    TopScroll,
    Snackbar,
    SideBar,
    Header,
    Footer
  },
  data: () => ({
    drawer: false
  }),
  computed: {
    ...mapGetters({
      user: "auth/user",
      userExists: "auth/userExists",
      permission: "auth/permission",
      permissionExists: "auth/permissionExists"
    })
  },
  async created() {
    await this.$store.dispatch("auth/checkAuth", "admin-higher")
  },
  methods: {
    // サイドバーの状態をセット
    setDrawer(value) {
      this.drawer = value
    }
  }
}
</script>
