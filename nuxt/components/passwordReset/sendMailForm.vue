<template>
  <Form @submit="$emit('submit')">
    <template #default="{ submit }">
      <v-container>
        <validation-provider
          v-slot="{ errors }"
          ref="emailValidation"
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
