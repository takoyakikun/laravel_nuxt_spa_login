<template>
  <Form @submit="$emit('submit')">
    <template #default="{ submit }">
      <v-container>
        <v-row dense>
          <v-col>
            <validation-provider
              v-slot="{ errors }"
              ref="currentPasswordValidation"
              :rules="{ required, min: 8 }"
              name="現在のパスワード"
              mode="lazy"
            >
              <v-text-field
                v-model="value.current_password"
                name="current_password"
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
              ref="passwordValidation"
              :rules="{ required, min: 8 }"
              name="変更後のパスワード"
              vid="password"
              mode="lazy"
            >
              <v-text-field
                v-model="value.password"
                name="password"
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
              ref="passwordConfirmationValidation"
              :rules="{ required, min: 8, confirmed: 'password' }"
              name="変更後のパスワード(確認)"
              mode="lazy"
            >
              <v-text-field
                v-model="value.password_confirmation"
                name="password_confirmation"
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
