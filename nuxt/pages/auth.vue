<template>
  <v-row align="center" justify="center">
    <v-col v-if="$store.state.auth.user" class="text-center">
      {{ user.name }}
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters } from "vuex"

export default {
  middleware: "auth",
  layout: "default",
  computed: {
    ...mapGetters({
      user: "auth/user"
    })
  }
}
</script>
