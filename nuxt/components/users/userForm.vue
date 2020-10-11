<template>
  <v-container>
    <v-row dense>
      <v-col>
        <validation-provider
          v-slot="{ errors }"
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
          :rules="{ required, email, max: 255 }"
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

    <v-row v-if="!myuser" dense>
      <v-col>
        <header>アクセス権限</header>
        <validation-provider
          v-slot="{ errors }"
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

    <v-row v-if="formType === 'create'" dense>
      <v-col>
        <validation-provider
          v-slot="{ errors }"
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

    <v-row v-if="formType === 'create'" dense>
      <v-col>
        <validation-provider
          v-slot="{ errors }"
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

<script>
import { mapGetters } from "vuex"
export default {
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
      permission: "auth/permission"
    }),

    // 権限ごとに選択できる権限を変える
    role() {
      return this.permission("system-only")
        ? this.config.role
        : this.config.role.filter(item => item.value !== 1)
    }
  },
  methods: {
    submit(event) {
      // 日本語入力時のEnterキーの反応を防ぐ
      if (event.keyCode && event.keyCode !== 13) return

      this.$emit("submit")
    }
  }
}
</script>
