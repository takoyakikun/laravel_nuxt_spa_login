<template>
  <v-form>
    <v-text-field
      v-model="formValue.email"
      label="Login"
      name="login"
      prepend-icon="mdi-account"
      type="text"
      @keydown.enter="submit"
    />

    <v-text-field
      id="password"
      v-model="formValue.password"
      label="Password"
      name="password"
      prepend-icon="mdi-lock"
      type="password"
      @keydown.enter="submit"
    />

    <v-checkbox
      v-model="formValue.remember"
      color="primary"
      label="Remember me"
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
      this.$emit("submit", event)
    }
  }
}
</script>
