<template>
  <!-- ダイアログ -->
  <v-dialog
    v-model="open"
    :max-width="maxWidth"
    :persistent="persistent"
    :scrollable="scrollable"
    @click:outside="outside"
  >
    <v-card>
      <v-app-bar :dark="dark" :color="color" class="headline">
        <slot :close="close" name="title">
          {{ title }}
          <v-spacer />
        </slot>
        <slot name="titleClose">
          <v-btn icon="icon" @click="close">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </slot>
      </v-app-bar>
      <v-card-text class="mt-5">
        <slot :close="close" name="content" />
      </v-card-text>
      <v-card-actions>
        <slot :close="close" name="actions">
          <v-spacer />
        </slot>
        <slot name="actionsClose">
          <v-btn @click="close">
            <v-icon left>
              mdi-close
            </v-icon>
            閉じる
          </v-btn>
        </slot>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    open: {
      type: Boolean,
      default: false
    },
    maxWidth: {
      type: Number,
      default: 600
    },
    persistent: {
      type: Boolean,
      default: false
    },
    scrollable: {
      type: String,
      default: "scrollable"
    },
    color: {
      type: String,
      default: ""
    },
    dark: {
      type: Boolean,
      default: true
    },
    title: {
      type: String,
      default: ""
    }
  },
  methods: {
    // ダイアログの外をクリック
    outside() {
      if (this.persistent === false) {
        this.close()
      }
    },
    // ダイアログを閉じる
    close() {
      this.$emit("update:open", false)
    }
  }
}
</script>
