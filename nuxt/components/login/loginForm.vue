<template>
  <Form @submit="$emit('submit')">
    <template #default="{ submit }">
      <validation-provider
        v-slot="{ errors }"
        :rules="{ required, max: 255, email }"
        mode="lazy"
        name="Login"
      >
        <v-text-field
          v-model="value.email"
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
        mode="lazy"
        name="Password"
        vid="password"
      >
        <v-text-field
          id="password"
          v-model="value.password"
          label="Password"
          name="password"
          prepend-icon="mdi-lock"
          type="password"
          :error-messages="errors"
          @keydown.enter="submit"
        />
      </validation-provider>

      <v-checkbox
        v-model="value.remember"
        color="primary"
        label="Remember me"
        @keydown.enter="submit"
      />
    </template>
  </Form>
</template>

<script>
import Form from "@/components/form/form"

export default {
  components: { Form },
  props: {
    value: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>
