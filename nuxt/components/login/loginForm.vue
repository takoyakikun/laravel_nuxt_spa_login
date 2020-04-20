<template>
  <v-form>
    <validation-provider
      v-slot="{ errors }"
      rules="required|max:255|email"
      mode="eager"
      name="Login"
    >
      <v-text-field
        v-model="formValue.email"
        label="Login"
        name="login"
        prepend-icon="mdi-account"
        type="text"
        :error-messages="errors"
        @keydown.enter="submit"
      />
    </validation-provider>

    <validation-provider
      v-slot="{ errors }"
      :rules="{ required }"
      name="Password"
      vid="password"
    >
      <v-text-field
        id="password"
        v-model="formValue.password"
        label="Password"
        name="password"
        prepend-icon="mdi-lock"
        type="password"
        :error-messages="errors"
        @keydown.enter="submit"
      />
    </validation-provider>

    <v-checkbox
      v-model="formValue.remember"
      color="primary"
      label="Remember me"
      @keydown.enter="submit"
    />
  </v-form>
</template>

<script>
export default {
  props: {
    formValue: {
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
