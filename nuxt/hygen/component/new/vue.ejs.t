---
to: "components/<%= directory %>/<%= name ? name : 'index' %>.vue"
---
<template>
</template>

<script>
import { defineComponent, reactive } from '@nuxtjs/composition-api'

export default defineComponent({
  name: '<%= h.changeCase.pascal(directory) + h.changeCase.pascal(name) %>Component',
  setup() {
    const state = reactive({})

    return {
      state
    }
  }
})
</script>
