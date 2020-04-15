<template>
  <v-app id="inspire">
    <v-content>
      <v-container class="fill-height" fluid>
        <nuxt />
      </v-container>
    </v-content>

    <!-- snackbar -->
    <v-snackbar v-model="snackbar.snackbar" :color="snackbar.color">
      {{ snackbar.text }}
    </v-snackbar>
  </v-app>
</template>

<script>
export default {
  computed: {
    // snackbarの状態をstoreと同期させる
    snackbar: {
      get() {
        return this.$store.state.snackbar
      },
      set(val) {
        this.$store.commit("snackbar/setSnackbar", val)
      }
    }
  }
}
</script>
