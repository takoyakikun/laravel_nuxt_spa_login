<template>
  <v-container>
    <v-row dense>
      <v-col cols="6">
        <validation-provider
          v-slot="{ errors }"
          :rules="{ required, max: 255 }"
          name="ユーザー名"
          mode="eager"
        >
          <v-text-field
            v-model="formValue.name"
            label="ユーザー名"
            max="255"
            required
            :error-messages="errors"
          />
        </validation-provider>
      </v-col>
    </v-row>

    <v-row dense>
      <v-col cols="6">
        <validation-provider
          v-slot="{ errors }"
          :rules="{ required, email, max: 255 }"
          name="メールアドレス"
          mode="eager"
        >
          <v-text-field
            v-model="formValue.email"
            label="メールアドレス"
            max="255"
            required
            :error-messages="errors"
          />
        </validation-provider>
      </v-col>
    </v-row>

    <v-row dense>
      <v-col>
        <header>アクセス権限</header>
        <validation-provider
          v-slot="{ errors }"
          :rules="{ required }"
          name="アクセス権限"
        >
          <v-radio-group v-model="formValue.role" row>
            <v-radio
              v-for="(item, index) in role"
              :key="index"
              :label="item.text"
              :value="item.value"
              color="primary"
              :error-messages="errors"
            />
          </v-radio-group>
        </validation-provider>
      </v-col>
    </v-row>

    <v-row v-if="formType === 'create'" dense>
      <v-col cols="6">
        <validation-provider
          v-slot="{ errors }"
          :rules="{ required, min: 8 }"
          name="パスワード"
          vid="password"
          mode="eager"
        >
          <v-text-field
            v-model="formValue.password"
            type="password"
            label="パスワード"
            min="8"
            required
            :error-messages="errors"
          />
        </validation-provider>
      </v-col>
    </v-row>

    <v-row v-if="formType === 'create'" dense>
      <v-col cols="6">
        <validation-provider
          v-slot="{ errors }"
          :rules="{ required, min: 8, confirmed: 'password' }"
          name="パスワード(確認)"
          mode="eager"
        >
          <v-text-field
            v-model="formValue.password_confirmation"
            type="password"
            label="パスワード(確認)"
            min="8"
            required
            :error-messages="errors"
          />
        </validation-provider>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex"
export default {
  props: {
    formValue: {
      type: Object,
      default: () => ({})
    },
    formType: {
      type: String,
      default: "create"
    }
  },
  computed: {
    ...mapState("config", {
      config: "data"
    }),
    ...mapGetters({
      getPermission: "auth/getPermission"
    }),

    // 権限ごとに選択できる権限を変える
    role() {
      if (this.getPermission("system-only")) {
        return this.config.role
      } else {
        return this.config.role.filter(item => item.value > 1)
      }
    }
  }
}
</script>
