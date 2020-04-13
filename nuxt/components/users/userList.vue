<template>
  <v-container fluid>
    <v-row dense>
      <v-col>
        <v-btn color="info" dark @click="openCreateDialog(item)">
          <v-icon left>
            mdi-account-plus
          </v-icon>
          新規追加
        </v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <!-- ユーザー一覧テーブル -->
        <v-data-table
          :headers="headers"
          :items="userList"
          disable-sort
          disable-pagination
          hide-default-footer
          class="elevation-1"
        >
          <template v-slot:item.role="{ value }">
            {{ getConfigText("role", value) }}
          </template>
          <template v-slot:item.action="{ item }">
            <v-tooltip left color="success">
              <template v-slot:activator="{ on }">
                <v-btn
                  icon
                  color="success"
                  :disabled="editDisabled(item)"
                  v-on="on"
                  @click="openEditDialog(item)"
                >
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </template>
              <span>編集</span>
            </v-tooltip>
            <v-tooltip right color="error">
              <template v-slot:activator="{ on }">
                <v-btn
                  icon
                  color="error"
                  :disabled="deleteDisabled(item)"
                  v-on="on"
                  @click="openDeleteDialog(item)"
                >
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </template>
              <span>削除</span>
            </v-tooltip>
          </template>
        </v-data-table>
      </v-col>
    </v-row>

    <!-- 新規追加ダイアログ -->
    <validation-observer ref="createForm" v-slot="{ invalid }">
      <c-my-dialog
        ref="createDialog"
        :open.sync="createDialog"
        title="新規ユーザー追加"
        color="info"
        persistent
      >
        <template v-slot:content>
          <c-user-form :form-value.sync="createFormValue" form-type="create" />
        </template>

        <template v-slot:actions>
          <v-btn :disabled="invalid" color="info" @click="createSubmit">
            <v-icon left>
              mdi-account-plus
            </v-icon>
            追加
          </v-btn>
          <v-spacer />
        </template>
      </c-my-dialog>
    </validation-observer>

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
          <c-user-form :form-value.sync="editFormValue" form-type="edit" />
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

    <!-- 削除ダイアログ -->
    <c-my-dialog
      ref="deleteDialog"
      :open.sync="deleteDialog"
      title="ユーザー削除"
      color="error"
    >
      <template v-slot:content>
        ユーザーを削除しますか？
      </template>

      <template v-slot:actions>
        <v-btn color="error" @click="deleteSubmit">
          <v-icon left>
            mdi-delete
          </v-icon>
          削除
        </v-btn>
        <v-spacer />
      </template>
    </c-my-dialog>
  </v-container>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex"
import CMyDialog from "~/components/dialog/myDialog"
import CUserForm from "~/components/users/userForm"

export default {
  components: {
    CMyDialog,
    CUserForm
  },
  data() {
    return {
      headers: [
        {
          text: "ユーザー名",
          value: "name"
        },
        {
          text: "メールアドレス",
          value: "email"
        },
        {
          text: "アクセス権限",
          value: "role"
        },
        {
          text: "編集/削除",
          value: "action"
        }
      ],
      createDialog: false,
      createFormValue: {},
      editDialog: false,
      editId: null,
      editFormValue: {},
      deleteDialog: false,
      deleteId: null
    }
  },
  computed: {
    ...mapState("auth", ["user"]),
    ...mapState("config", { config: "data" }),
    ...mapState("users", {
      userList: "list"
    }),
    ...mapGetters({
      getConfigText: "config/getConfigText",
      getPermission: "auth/getPermission"
    }),

    // 編集不可のユーザー
    editDisabled() {
      return item => {
        let result = true
        if (this.getPermission("system-only")) {
          // 開発者権限はすべて編集可能
          result = false
        } else if (this.getPermission("admin-higher")) {
          // 管理者権限は開発者権限以外編集可能
          if (item.role > 1) {
            result = false
          }
        }
        return result
      }
    },

    // 削除不可のユーザー
    deleteDisabled() {
      return item => {
        let result = true
        if (this.user && this.user.id === item.id) {
          // 自ユーザーは削除不可
          result = true
        } else if (this.getPermission("system-only")) {
          // 開発者権限はすべて編集可能
          result = false
        } else if (this.getPermission("admin-higher")) {
          if (item.role > 1) {
            // 管理者権限は開発者権限以外編集可能
            result = false
          }
        }
        return result
      }
    }
  },
  mounted() {
    this.$store.dispatch("auth/checkAuth", "system-only")
  },
  methods: {
    ...mapActions("users", ["createData", "editData", "deleteData"]),
    ...mapActions("snackbar", ["openSnackbar"]),

    // 新規追加ダイアログを開く
    openCreateDialog() {
      this.createDialog = true
    },
    // データを追加
    async createSubmit() {
      await this.$refs.createForm.validate().then(result => {
        if (result) {
          this.createData(this.createFormValue)
            .then(res => {
              this.openSnackbar({
                text: "ユーザーデータを追加しました。",
                color: "success"
              })
              return res
            })
            .catch(e => {
              this.openSnackbar({
                text: "ユーザーデータの追加に失敗しました。",
                color: "error"
              })
            })
            .then(res => {
              this.$refs.createDialog.close()
              this.createFormValue = {}
              this.$refs.createForm.reset()
            })
        }
      })
    },
    // 編集ダイアログを開く
    openEditDialog(item) {
      this.editDialog = true
      this.editId = item.id
      this.editFormValue = JSON.parse(JSON.stringify(item)) // ディープコピー
    },
    // データを更新
    async editSubmit() {
      await this.$refs.editForm.validate().then(result => {
        if (result) {
          this.editData({
            formValue: this.editFormValue,
            id: this.editId
          })
            .then(res => {
              this.openSnackbar({
                text: "ユーザーデータを更新しました。",
                color: "success"
              })
              return res
            })
            .catch(e => {
              this.openSnackbar({
                text: "ユーザーデータの更新に失敗しました。",
                color: "error"
              })
            })
            .then(res => {
              this.$refs.editDialog.close()
              this.$refs.editForm.reset()
              this.$store.dispatch("auth/nuxtClientInit")
            })
        }
      })
    },
    // 削除ダイアログを開く
    openDeleteDialog(item) {
      this.deleteDialog = true
      this.deleteId = item.id
    },
    // データを削除
    async deleteSubmit() {
      this.deleteData(this.deleteId)
        .then(res => {
          this.openSnackbar({
            text: "ユーザーデータを削除しました。",
            color: "success"
          })
          return res
        })
        .catch(e => {
          this.openSnackbar({
            text: "ユーザーデータの削除に失敗しました。",
            color: "error"
          })
        })
        .then(res => {
          this.$refs.deleteDialog.close()
        })
    }
  }
}
</script>
