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
