<template>
  <div>
    <ValidationProvider
      v-slot="props"
      ref="validation"
      v-bind="createValidationOptions"
    >
      <slot :options="createFormOptions" v-bind="props">
        <v-textarea
          v-if="type === 'textarea'"
          :value="value"
          v-bind="createFormOptions"
          :error-messages="props.errors"
          @input="$emit('input', $event)"
        />
        <v-text-field
          v-else
          :value="value"
          v-bind="createFormOptions"
          :error-messages="props.errors"
          @input="$emit('input', $event)"
        />
      </slot>
    </ValidationProvider>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: [Number, String, Array, Object],
      default: ""
    },
    rules: {
      type: [Object, String],
      default: () => ({})
    },
    mode: {
      type: String,
      default: ""
    },
    type: {
      type: String,
      default: "text"
    },
    label: {
      type: String,
      default: ""
    },
    name: {
      type: String,
      default: ""
    },
    validationOptions: {
      type: Object,
      default: () => ({})
    },
    formOptions: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    // バリデーションのオプションを生成
    createValidationOptions() {
      let options = this.validationOptions
      if (Object.keys(this.rules).length) {
        options.rules = this.rules
      }
      if (this.mode) {
        options.mode = this.mode
      }
      if (this.label) {
        options.name = this.label
      }
      if (this.name) {
        options.vid = this.name
      }
      return options
    },

    // フォームフィールドのオプションを生成
    createFormOptions() {
      let options = this.formOptions
      options.type = this.type
      if (this.label) {
        options.label = this.label
      }
      if (this.name) {
        options.name = this.name
      }
      let rules = this.rules
      if (this.validationOptions.rules) {
        rules = this.validationOptions.rules
      }
      for (let key in rules) {
        switch (key) {
          case "required":
            options.required = true
            break
          case "min":
            options.min = rules[key]
            break
          case "max":
            options.max = rules[key]
            break
        }
      }
      return options
    }
  },
  methods: {
    validate(value) {
      if (value) {
        return this.$refs.validation.validate(value)
      } else {
        return this.$refs.validation.validate()
      }
    },
    validateSilent() {
      return this.$refs.validation.validateSilent()
    },
    applyResult(ValidationResult) {
      return this.$refs.validation.applyResult(ValidationResult)
    },
    reset() {
      return this.$refs.validation.reset()
    },
    setFlags(flags) {
      return this.$refs.validation.setFlags(flags)
    },
    setErrors(errors) {
      return this.$refs.validation.setErrors(errors)
    },
    syncValue(value) {
      return this.$refs.validation.syncValue(value)
    },

    // エラー内容を取得
    getFailedRules() {
      return this.$refs.validation.failedRules
    }
  }
}
</script>
