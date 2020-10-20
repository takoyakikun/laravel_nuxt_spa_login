<template>
  <Form @submit="$emit('submit')">
    <template #default="{ submit }">
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
            name="password"
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
            name="password_confirmation"
            prepend-icon="mdi-lock"
            min="8"
            required
            :error-messages="errors"
            @keydown.enter="submit"
          />
        </validation-provider>
      </v-container>
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
