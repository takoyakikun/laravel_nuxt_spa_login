<template>
  <v-snackbar
    v-model="snackbar.value"
    v-bind="snackbar.options"
    @input="snackbar.closeSnackbar()"
  >
    <slot :text="snackbar.text">
      {{ snackbar.text }}
    </slot>
  </v-snackbar>
</template>

<script>
import { defineComponent, useContext, reactive } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'snackbarComponent',
  setup() {
    const { app } = useContext()
    const snackbar = reactive(app.$snackbar)

    // ローカルストレージにメッセージデータがある場合は表示する
    if (localStorage.getItem('snacbar')) {
      try {
        const localSnackbar = JSON.parse(localStorage.getItem('snacbar'))
        snackbar.openSnackbar(localSnackbar)
      } finally {
        localStorage.setItem('snacbar', '')
      }
    }

    return {
      snackbar
    }
  }
})
</script>
