---
to: "pages/<%= directory %>/<%= name ? name : 'index' %>.vue"
---
<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { defineComponent, reactive } from '@nuxtjs/composition-api'

export default defineComponent({
  name: '<%= h.changeCase.pascal(directory) + h.changeCase.pascal(name) %>Page',
  middleware: '<%= middleware %>',
  layout: '<%= layout %>',
  components: {},
  setup() {
    const state = reactive({})

    return {
      state
    }
  },
  head() {
    return {
      title: '<%= title %>'
    }
  }
})
</script>
