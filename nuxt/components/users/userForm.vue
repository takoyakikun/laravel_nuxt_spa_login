<template>
  <Form @submit="$emit('submit')">
    <template #default="{ submit }">
      <v-container>
        <v-row dense>
          <v-col>
            <validation-provider
              v-slot="{ errors }"
              ref="nameValidation"
              :rules="{ required, max: 255 }"
              name="ユーザー名"
              mode="lazy"
            >
              <v-text-field
                v-model="value.name"
                name="name"
                label="ユーザー名"
                max="255"
                required
                :error-messages="errors"
                @keydown.enter="submit"
              />
            </validation-provider>
          </v-col>
        </v-row>

        <v-row dense>
          <v-col>
            <validation-provider
              v-slot="{ errors }"
              ref="emailValidation"
              :rules="{ required, max: 255, email }"
              name="メールアドレス"
              mode="lazy"
            >
              <v-text-field
                v-model="value.email"
                name="email"
                label="メールアドレス"
                max="255"
                required
                :error-messages="errors"
                @keydown.enter="submit"
              />
            </validation-provider>
          </v-col>
        </v-row>

        <v-row v-if="!myuser" dense data-test="roleForm">
          <v-col>
            <header>アクセス権限</header>
            <validation-provider
              v-slot="{ errors }"
              ref="roleValidation"
              :rules="{ required }"
              name="アクセス権限"
            >
              <v-radio-group
                v-model="value.role"
                name="role"
                row
                :error-messages="errors"
              >
                <v-radio
                  v-for="item in role"
                  :key="item.value"
                  :label="item.text"
                  :value="item.value"
                  color="primary"
                  @keydown.enter="submit"
                />
              </v-radio-group>
            </validation-provider>
          </v-col>
        </v-row>

        <v-row v-if="formType === 'create'" dense data-test="passwordForm">
          <v-col>
            <validation-provider
              v-slot="{ errors }"
              ref="passwordValidation"
              :rules="{ required, min: 8 }"
              name="パスワード"
              vid="password"
              mode="lazy"
            >
              <v-text-field
                v-model="value.password"
                name="password"
                type="password"
                label="パスワード"
                min="8"
                required
                :error-messages="errors"
                @keydown.enter="submit"
              />
            </validation-provider>
          </v-col>
        </v-row>

        <v-row
          v-if="formType === 'create'"
          dense
          data-test="passwordConfirmationForm"
        >
          <v-col>
            <validation-provider
              v-slot="{ errors }"
              ref="passwordConfirmationValidation"
              :rules="{ required, min: 8, confirmed: 'password' }"
              name="パスワード(確認)"
              mode="lazy"
            >
              <v-text-field
                v-model="value.password_confirmation"
                name="password_confirmation"
                type="password"
                label="パスワード(確認)"
                min="8"
                required
                :error-messages="errors"
                @keydown.enter="submit"
              />
            </validation-provider>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </Form>
</template>

<script>
import { mapGetters } from "vuex"
import Form from "@/components/form/form"

export default {
  components: { Form },
  props: {
    value: {
      type: Object,
      default: () => ({})
    },
    formType: {
      type: String,
      default: "create"
    },
    myuser: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters({
      config: "config/config",
      permission: "auth/permission",
      roleOptions: "users/roleOptions"
    }),

    // 権限ごとに選択できる権限を変える
    role() {
      return this.config.roleOptions.filter(item =>
        this.roleOptions.includes(item.value)
      )
    }
  }
}
</script>
