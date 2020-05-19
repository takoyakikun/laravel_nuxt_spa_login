<template>
  <v-container>
    <v-row dense>
      <v-col>
        <validation-provider
          v-slot="{ errors }"
          :rules="{ required, min: 8 }"
          name="現在のパスワード"
          mode="lazy"
        >
          <v-text-field
            v-model="value.current_password"
            type="password"
            label="現在のパスワード"
            min="8"
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
          :rules="{ required, min: 8 }"
          name="変更後のパスワード"
          vid="password"
          mode="lazy"
        >
          <v-text-field
            v-model="value.password"
            type="password"
            label="変更後のパスワード"
            min="8"
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
          :rules="{ required, min: 8, confirmed: 'password' }"
          name="変更後のパスワード(確認)"
          mode="lazy"
        >
          <v-text-field
            v-model="value.password_confirmation"
            type="password"
            label="変更後のパスワード(確認)"
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
export default {
  props: {
    value: {
      type: Object,
      default: () => ({})
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
