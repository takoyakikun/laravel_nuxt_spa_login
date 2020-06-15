<template>
  <v-container>
    <validation-provider
      v-slot="{ errors }"
      :rules="{ required, max: 255, email }"
      mode="lazy"
      name="Email"
    >
      <v-text-field
        v-model="value.email"
        label="Email"
        name="email"
        prepend-icon="mdi-email"
        type="text"
        :error-messages="errors"
        @keydown.enter="submit"
      />
    </validation-provider>

    <validation-provider
      v-slot="{ errors }"
      :rules="{ required, min: 8 }"
      name="パスワード"
      vid="password"
      mode="lazy"
    >
      <v-text-field
        v-model="value.password"
        type="password"
        label="パスワード"
        prepend-icon="mdi-lock"
        min="8"
        required
        :error-messages="errors"
        @keydown.enter="submit"
      />
    </validation-provider>

    <validation-provider
      v-slot="{ errors }"
      :rules="{ required, min: 8, confirmed: 'password' }"
      name="パスワード(確認)"
      mode="lazy"
    >
      <v-text-field
        v-model="value.password_confirmation"
        type="password"
        label="パスワード(確認)"
        prepend-icon="mdi-lock"
        min="8"
        required
        :error-messages="errors"
        @keydown.enter="submit"
      />
    </validation-provider>
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
