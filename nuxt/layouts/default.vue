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
      <!-- サイドバー開閉 -->
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />

      <v-toolbar-title>Application</v-toolbar-title>
      <v-spacer />

      <!-- マイユーザー管理 -->
      <v-menu v-if="user" offset-y>
        <template v-slot:activator="{ on }">
          <v-btn class="mx-1" outlined rounded v-on="on">
            <v-icon left>
              mdi-account-circle
            </v-icon>
            {{ user.name }}
            <v-icon right>
              mdi-menu-down
            </v-icon>
          </v-btn>
        </template>
        <v-list>
          <!-- マイユーザー編集 -->
          <v-list-item @click="openEditDialog">
            <v-list-item-title>
              <v-icon left>
                mdi-account-edit
              </v-icon>
              編集
            </v-list-item-title>
          </v-list-item>

          <!-- パスワード変更 -->
          <v-list-item @click="openPasswordChangeDialog">
            <v-list-item-title>
              <v-icon left>
                mdi-lock
              </v-icon>
              パスワード変更
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <!-- 新規ユーザー作成 -->
      <v-btn v-if="!user" class="mx-1" outlined to="register">
        <v-icon left>
          mdi-account-plus
        </v-icon>
        新規作成
      </v-btn>

      <!-- ログアウト -->
      <v-btn v-if="user" class="mx-1" outlined @click="logout">
        <v-icon left>
          mdi-logout-variant
        </v-icon>
        Logout
      </v-btn>

      <!-- ログイン -->
      <v-btn v-if="!user" class="mx-1" outlined to="login">
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

    <!-- 編集ダイアログ -->
    <validation-observer ref="editForm" v-slot="{ invalid }">
      <c-my-dialog
        ref="editDialog"
        :open.sync="editDialog"
        title="ユーザー編集"
        color="success"
        persistent
      >
        <template v-slot:content>
          <c-user-form
            :form-value.sync="editFormValue"
            form-type="edit"
            myuser
            @submit="editSubmit"
          />
        </template>

        <template v-slot:actions>
          <v-btn :disabled="invalid" color="success" @click="editSubmit">
            <v-icon left>
              mdi-account-edit
            </v-icon>
            更新
          </v-btn>
          <v-spacer />
        </template>
      </c-my-dialog>
    </validation-observer>

    <!-- パスワード変更ダイアログ -->
    <validation-observer ref="passwordChangeForm" v-slot="{ invalid }">
      <c-my-dialog
        ref="passwordChangeDialog"
        :open.sync="passwordChangeDialog"
        title="パスワード変更"
        color="success"
        persistent
      >
        <template v-slot:content>
          <c-password-change-form
            :form-value.sync="passwordChangeFormValue"
            @submit="passwordChangeSubmit"
          />
        </template>

        <template v-slot:actions>
          <v-btn
            :disabled="invalid"
            color="success"
            @click="passwordChangeSubmit"
          >
            <v-icon left>
              mdi-lock
            </v-icon>
            変更
          </v-btn>
          <v-spacer />
        </template>
      </c-my-dialog>
    </validation-observer>

    <!-- snackbar -->
    <v-snackbar v-model="snackbar.snackbar" :color="snackbar.color">
      {{ snackbar.text }}
    </v-snackbar>
  </v-app>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex"
import CMyDialog from "~/components/dialog/myDialog"
import CUserForm from "~/components/users/userForm"
import CPasswordChangeForm from "~/components/users/passwordChangeForm"

export default {
  components: {
    CMyDialog,
    CUserForm,
    CPasswordChangeForm
  },
  data: () => ({
    drawer: false,
    editDialog: false,
    editFormValue: {},
    passwordChangeDialog: false,
    passwordChangeFormValue: {}
  }),
  computed: {
    ...mapState("auth", {
      user: "user"
    }),
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
    ...mapActions("users", ["editData", "passwordChange"]),

    // ログアウト
    async logout() {
      await this.$store.dispatch("auth/logout")

      this.$router.push("/")
    },

    // 編集ダイアログを開く
    openEditDialog() {
      this.editDialog = true
      this.editFormValue = JSON.parse(JSON.stringify(this.user)) // ディープコピー
    },
    // データを更新
    async editSubmit() {
      await this.$refs.editForm.validate().then(result => {
        if (result) {
          this.editData({
            formValue: this.editFormValue
          })
            .then(res => {
              this.openSnackbar({
                text: "ユーザーデータを更新しました。",
                color: "success"
              })
              this.$refs.editDialog.close()
              this.$refs.editForm.reset()
              this.$store.dispatch("auth/nuxtClientInit")
            })
            .catch(e => {
              this.openSnackbar({
                text: "ユーザーデータの更新に失敗しました。",
                color: "error"
              })
            })
        }
      })
    },

    // パスワード変更ダイアログを開く
    openPasswordChangeDialog() {
      this.passwordChangeDialog = true
      this.passwordChangeFormValue = {}
    },
    // パスワードを変更
    async passwordChangeSubmit() {
      await this.$refs.passwordChangeForm.validate().then(result => {
        if (result) {
          this.passwordChange(this.passwordChangeFormValue)
            .then(res => {
              this.openSnackbar({
                text: "パスワードを変更しました。",
                color: "success"
              })
              this.$refs.passwordChangeDialog.close()
              this.$refs.passwordChangeForm.reset()
            })
            .catch(e => {
              let text = "パスワードの変更に失敗しました。"
              if (e.response.data.error_message) {
                text = e.response.data.error_message
              }
              this.openSnackbar({
                text: text,
                color: "error"
              })
            })
        }
      })
    }
  }
}
</script>
