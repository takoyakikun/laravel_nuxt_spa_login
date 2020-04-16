<template>
  <v-container>
    <v-row dense>
      <v-col>
        <validation-provider
          v-slot="{ errors }"
          :rules="{ required, min: 8 }"
          name="現在のパスワード"
          mode="eager"
        >
          <v-text-field
            v-model="formValue.current_password"
            type="password"
            label="現在のパスワード"
            min="8"
            required
            :error-messages="errors"
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
          mode="eager"
        >
          <v-text-field
            v-model="formValue.password"
            type="password"
            label="変更後のパスワード"
            min="8"
            required
            :error-messages="errors"
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
          mode="eager"
        >
          <v-text-field
            v-model="formValue.password_confirmation"
            type="password"
            label="変更後のパスワード(確認)"
            min="8"
            required
            :error-messages="errors"
          />
        </validation-provider>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  props: {
    formValue: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>
