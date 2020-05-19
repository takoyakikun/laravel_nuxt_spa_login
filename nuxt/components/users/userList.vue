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
      <MyDialog
        ref="createDialog"
        :open.sync="createDialog"
        title="新規ユーザー追加"
        color="info"
        persistent
      >
        <template v-slot:content>
          <UserForm
            v-model="createFormValue"
            form-type="create"
            @submit="createSubmit"
          />
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
      </MyDialog>
    </validation-observer>

    <!-- 編集ダイアログ -->
    <validation-observer ref="editForm" v-slot="{ invalid }">
      <MyDialog
        ref="editDialog"
        :open.sync="editDialog"
        title="ユーザー編集"
        color="success"
        persistent
      >
        <template v-slot:content>
          <UserForm
            v-model="editFormValue"
            form-type="edit"
            :myuser.sync="myuser"
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
      </MyDialog>
    </validation-observer>

    <!-- 削除ダイアログ -->
    <MyDialog
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
    </MyDialog>
  </v-container>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex"
import MyDialog from "~/components/dialog/myDialog"
import UserForm from "~/components/users/userForm"

export default {
  components: {
    MyDialog,
    UserForm
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
    ...mapState("config", { config: "data" }),
    ...mapState("users", {
      userList: "list"
    }),
    ...mapGetters({
      getConfigText: "config/getConfigText",
      user: "auth/user",
      userExists: "auth/userExists",
      permission: "auth/permission"
    }),

    // 編集不可のユーザー
    editDisabled() {
      return item => {
        let result = true
        if (this.permission("system-only")) {
          // 開発者権限はすべて編集可能
          result = false
        } else if (this.permission("admin-higher")) {
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
        } else if (this.permission("system-only")) {
          // 開発者権限はすべて編集可能
          result = false
        } else if (this.permission("admin-higher")) {
          if (item.role > 1) {
            // 管理者権限は開発者権限以外編集可能
            result = false
          }
        }
        return result
      }
    },

    // 自ユーザーかどうか
    myuser() {
      return this.user.id === this.editId
    }
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
      await this.$refs.createForm.validate().then(async result => {
        if (result) {
          await this.createData(this.createFormValue)
            .then(() => {
              this.openSnackbar({
                text: "ユーザーデータを追加しました。",
                options: { color: "success" }
              })
              this.$refs.createDialog.close()
              this.createFormValue = {}
              this.$refs.createForm.reset()
            })
            .catch(() => {
              this.openSnackbar({
                text: "ユーザーデータの追加に失敗しました。",
                options: { color: "error" }
              })
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
      await this.$refs.editForm.validate().then(async result => {
        if (result) {
          const option = {
            formValue: this.editFormValue
          }
          // 自ユーザー以外はidを設定
          if (!this.myuser) {
            option.id = this.editId
          }

          await this.editData(option)
            .then(() => {
              this.openSnackbar({
                text: "ユーザーデータを更新しました。",
                options: { color: "success" }
              })
              this.$refs.editDialog.close()
              this.$refs.editForm.reset()
              this.$store.dispatch("auth/setUser")
            })
            .catch(() => {
              this.openSnackbar({
                text: "ユーザーデータの更新に失敗しました。",
                options: { color: "error" }
              })
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
      await this.deleteData(this.deleteId)
        .then(() => {
          this.openSnackbar({
            text: "ユーザーデータを削除しました。",
            options: { color: "success" }
          })
          this.$refs.deleteDialog.close()
        })
        .catch(() => {
          this.openSnackbar({
            text: "ユーザーデータの削除に失敗しました。",
            options: { color: "error" }
          })
        })
    }
  }
}
</script>
