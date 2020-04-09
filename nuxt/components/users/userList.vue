<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <!-- 未確認申込一覧テーブル -->
        <v-data-table
          :headers="headers"
          :items="userList"
          disable-sort
          disable-pagination
          hide-default-footer
          class="elevation-1"
        >
          <template v-slot:item.role="{ value }">
            {{ config.role[value] }}
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex"
export default {
  components: {},
  data() {
    return {
      headers: [
        {
          text: "ユーザー名",
          value: "name"
        },
        {
          text: "メールアドレス",
          value: "email"
        },
        {
          text: "アクセス権限",
          value: "role"
        }
      ]
    }
  },
  computed: {
    ...mapState("auth", ["user"]),
    ...mapState("config", { config: "data" }),
    ...mapState("users", {
      userList: "list"
    })
  },
  methods: {}
}
</script>
