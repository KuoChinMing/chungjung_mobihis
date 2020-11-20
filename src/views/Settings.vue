<template>
  <div>
    <v-app-bar color="primary" dark>
      <v-btn icon @click="routerBack">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      <v-toolbar-title>{{ $t("settings") }}</v-toolbar-title>
    </v-app-bar>

    <v-container fluid>
      <v-row>
        <v-col cols="12">
          <v-card>
            <v-list expand>
              <v-list-group prepend-icon="mdi-account">
                <template v-slot:activator>
                  <v-list-item-content>
                    <v-list-item-title>{{ $t("userProfile") }}</v-list-item-title>
                  </v-list-item-content>
                </template>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>{{ $t("userName") }}</v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-list-item-title>{{ account }}</v-list-item-title>
                  </v-list-item-action>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>{{ $t("userPosition") }}</v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-list-item-title>TODO</v-list-item-title>
                  </v-list-item-action>
                </v-list-item>
              </v-list-group>

              <v-list-group prepend-icon="mdi-settings">
                <template v-slot:activator>
                  <v-list-item-content>
                    <v-list-item-title>{{ $t("systemSettings") }}</v-list-item-title>
                  </v-list-item-content>
                </template>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>{{ $t("language.language") }}</v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-menu offset-y>
                      <template v-slot:activator="{ on, attrs }">
                        <v-list-item-title v-bind="attrs" v-on="on">
                          {{ $t("language." + currentLocale) }}
                          <v-icon small>mdi-chevron-down</v-icon>
                        </v-list-item-title>
                      </template>
                      <v-card max-height="200">
                        <v-list dense>
                          <v-list-item-group :value="currentLocale" prepend-icon="mdi-close">
                            <v-list-item
                              v-for="(locale, index) in supportedLocales"
                              :key="index"
                              :value="locale"
                              @click="switchLocale(locale)"
                            >
                              <v-list-item-title>
                                {{ $t("language." + locale) }}
                              </v-list-item-title>
                            </v-list-item>
                          </v-list-item-group>
                        </v-list>
                      </v-card>
                    </v-menu>
                  </v-list-item-action>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>{{ $t("useRocYear") }}</v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-switch></v-switch>
                  </v-list-item-action>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>{{ $t("dischargedQueryPeriod") }}</v-list-item-title>
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
                    <v-list-item-title>{{ $t("ipSettings") }}</v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-text-field dense hide-details></v-text-field>
                  </v-list-item-action>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>{{ $t("museIpSettings") }}</v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-text-field dense hide-details></v-text-field>
                  </v-list-item-action>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>{{ $t("idoServerName") }}</v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-text-field dense hide-details></v-text-field>
                  </v-list-item-action>
                </v-list-item>
              </v-list-group>

              <v-list-group prepend-icon="mdi-clipboard-pulse">
                <template v-slot:activator>
                  <v-list-item-content>
                    <v-list-item-title>{{ $t("udeSettings") }}</v-list-item-title>
                  </v-list-item-content>
                </template>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>{{ $t("useUde") }}</v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-switch></v-switch>
                  </v-list-item-action>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>{{ $t("aetSettings") }}</v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-text-field dense hide-details></v-text-field>
                  </v-list-item-action>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>{{ $t("ipSettings") }}</v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-text-field dense hide-details></v-text-field>
                  </v-list-item-action>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>{{ $t("portSettings") }}</v-list-item-title>
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
                  <v-list-item-title>{{ $t("login.logout") }}</v-list-item-title>
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
import { mapState } from "vuex";
import { translation } from "@/plugins/translation.js";

export default {
  name: "Settings",

  data() {
    return {
      prevRoute: null,
      selectedPeriod: "todo",
      periods: ["TODO1", "TODO2", "TODO3", "TODO4", "TODO5"]
    };
  },

  computed: {
    ...mapState(["account"]),
    currentLocale() {
      return translation.currentLocale;
    },
    supportedLocales() {
      return translation.supportedLocales;
    }
  },

  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.prevRoute = from;
    });
  },

  methods: {
    routerBack() {
      this.$router.push({
        name: this.prevRoute.name || "Home",
        params: { ...this.prevRoute.params, locale: translation.currentLocale }
      });
    },
    switchLocale(locale) {
      if (locale === translation.currentLocale) return;
      const to = this.$router.resolve({ params: { locale } });
      translation.changeLocale(locale).then(() => {
        this.$router.replace(to.location);
      });
    },
    logout() {
      localStorage.clear();
      this.$router.push({ name: "Login" });
    }
  }
};
</script>
