<template>
  <div>
    <ValidationObserver ref="validate" v-slot="{ invalid }">
      <MyDialog
        ref="dialog"
        title="新規ユーザー追加"
        color="info"
        :options="{ persistent: true }"
      >
        <template #content>
          <UserForm
            v-model="formValue"
            form-type="usersCreate"
            @submit="submit"
          />
        </template>

        <template #actionsRight="{ state }">
          <v-btn
            data-test="submitButton"
            :disabled="invalid"
            :color="state.color"
            :loading="loading"
            @click="submit"
          >
            <v-icon left>
              mdi-account-plus
            </v-icon>
            追加
          </v-btn>
        </template>
      </MyDialog>
    </ValidationObserver>
  </div>
</template>

<script>
import MyDialog from '~/components/dialog/myDialog'
import UserForm from '~/components/users/forms/userForm'

export default {
  name: 'UserCreateDialogComponent',
  components: {
    MyDialog,
    UserForm
  },
  data() {
    return {
      loading: false,
      formValue: {}
    }
  },
  methods: {
    // ダイアログを開く
    openDialog() {
      this.$refs.dialog.openDialog()
    },
    // データを追加
    async submit() {
      if (!this.loading) {
        this.loading = true
        await this.$refs.validate.validate().then(async result => {
          if (result) {
            await this.$api.users.createData(this.formValue).then(res => {
              if (res.status === 200) {
                this.$snackbar.openSnackbar({
                  text: 'ユーザーデータを追加しました。',
                  options: { color: 'success' }
                })
                this.$refs.dialog.closeDialog()
                this.formValue = {}
                this.$refs.validate.reset()
              } else {
                this.$snackbar.openSnackbar({
                  text: 'ユーザーデータの追加に失敗しました。',
                  options: { color: 'error' }
                })
              }
            })
          }
        })
        this.loading = false
      }
    }
  }
}
</script>
