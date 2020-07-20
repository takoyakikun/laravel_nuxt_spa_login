<template>
  <!-- トップスクロールボタン -->
  <v-fade-transition>
    <v-btn
      v-show="showTopScroll"
      color="primary"
      transition="fade-transition"
      dark
      fixed
      bottom
      right
      fab
      @click="topScroll"
    >
      <v-icon>mdi-chevron-up</v-icon>
    </v-btn>
  </v-fade-transition>
</template>

<script>
import goTo from "vuetify/es5/services/goto"
export default {
  props: {
    options: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      showTopScroll: false
    }
  },
  mounted() {
    window.addEventListener("scroll", this.handleScroll)
  },
  destroyed() {
    window.removeEventListener("scroll", this.handleScroll)
  },
  methods: {
    // トップスクロールボタンを表示
    handleScroll() {
      this.showTopScroll = window.scrollY > 100
    },
    // 画面トップにスクロール
    topScroll() {
      goTo(0, this.options)
    }
  }
}
</script>
