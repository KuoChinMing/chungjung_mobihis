<template>
  <div>
    <SettingsAppBar color="primary" dark title="設定" />

    <v-container>
      <v-row>
        <v-col cols="12">
          <v-card>
            <v-list expand>
              <v-list-group prepend-icon="mdi-account">
                <template v-slot:activator>
                  <v-list-item-content>
                    <v-list-item-title>基本資料</v-list-item-title>
                  </v-list-item-content>
                </template>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>使用者</v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-list-item-title>{{ account }}</v-list-item-title>
                  </v-list-item-action>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>職稱</v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-list-item-title>TODO</v-list-item-title>
                  </v-list-item-action>
                </v-list-item>
              </v-list-group>

              <v-list-group prepend-icon="mdi-settings">
                <template v-slot:activator>
                  <v-list-item-content>
                    <v-list-item-title>系統設定</v-list-item-title>
                  </v-list-item-content>
                </template>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>使用明國年顯示</v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-switch></v-switch>
                  </v-list-item-action>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>出院查詢區間</v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-menu offset-y>
                      <template v-slot:activator="{ on, attrs }">
                        <v-list-item-title v-bind="attrs" v-on="on">
                          {{ selectedPeriod }}
                          <v-icon small>mdi-chevron-down</v-icon>
                        </v-list-item-title>
                      </template>
                      <v-card max-height="200">
                        <v-list dense>
                          <v-list-item-group v-model="selectedPeriod">
                            <v-list-item
                              v-for="(period, index) in periods"
                              :key="index"
                              :value="period"
                            >
                              <v-list-item-title>{{ period }}</v-list-item-title>
                            </v-list-item>
                          </v-list-item-group>
                        </v-list>
                      </v-card>
                    </v-menu>
                  </v-list-item-action>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>IP 設定</v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-text-field dense hide-details></v-text-field>
                  </v-list-item-action>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>Muse IP 設定</v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-text-field dense hide-details></v-text-field>
                  </v-list-item-action>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>iDO Server Name</v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-text-field dense hide-details></v-text-field>
                  </v-list-item-action>
                </v-list-item>
              </v-list-group>

              <v-list-group prepend-icon="mdi-clipboard-pulse">
                <template v-slot:activator>
                  <v-list-item-content>
                    <v-list-item-title>UDE 設定</v-list-item-title>
                  </v-list-item-content>
                </template>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>使用 UDE</v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-switch></v-switch>
                  </v-list-item-action>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>AET 設定</v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-text-field dense hide-details></v-text-field>
                  </v-list-item-action>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>IP 設定</v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-text-field dense hide-details></v-text-field>
                  </v-list-item-action>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>Port 設定</v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-text-field dense hide-details></v-text-field>
                  </v-list-item-action>
                </v-list-item>
              </v-list-group>

              <v-list-item @click="logout">
                <v-list-item-icon>
                  <v-icon>mdi-account-arrow-right</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-title>登出</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import SettingsAppBar from "@/views/SettingsAppBar.vue";

export default {
  name: "Settings",

  components: {
    SettingsAppBar
  },

  data() {
    return {
      selectedPeriod: "todo",
      periods: [
        "一週",
        "兩週",
        "一個月",
        "兩個月",
        "三個月",
        "四個月",
        "五個月",
        "六個月",
        "一年",
        "兩年"
      ]
    };
  },

  computed: {
    account() {
      return this.$store.state.account;
    }
  },

  methods: {
    logout() {
      localStorage.clear();
      this.$router.push({ name: "Login" });
    }
  }
};
</script>

<style lang="scss" scoped>
.v-select__selections input {
  display: none;
}
.select {
  min-width: 100px;
}
</style>
