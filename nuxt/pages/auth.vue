<template>
  <v-row align="center" justify="center">
    <v-col class="text-center">
      {{ $store.state.auth.user.name }}
    </v-col>
  </v-row>
</template>

<script>
export default {
  middleware: "auth",
  layout: "default"
}
</script>
