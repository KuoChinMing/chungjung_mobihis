<template>
  <div>
    <v-navigation-drawer
      :value="homeNavigationDrawer"
      @input="toggleHomeNavigationDrawer"
      fixed
      temporary
    >
      <v-list nav expand>
        <v-list-item-group color="primary">
          <v-list-item :to="{ name: 'Home' }" exact>
            <v-list-item-icon>
              <v-icon>mdi-star</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ $t("myPatient") }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item :to="{ name: 'Discharged' }">
            <v-list-item-icon>
              <v-icon>mdi-account-arrow-right</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ $t("dischargedPatient") }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-group prepend-icon="mdi-hospital">
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title> {{ $t("buildings") }} / {{ $t("station") }} </v-list-item-title>
              </v-list-item-content>
            </template>

            <v-list-group sub-group v-for="(building, i) in Object.keys(stations)" :key="i">
              <template v-slot:activator>
                <v-list-item-content>
                  <v-list-item-title>{{ building }}</v-list-item-title>
                </v-list-item-content>
              </template>

              <v-list-item
                v-for="(station, i) in stations[building]"
                :key="i"
                exact
                :to="{ name: 'Station', params: { station: station.WardNo } }"
              >
                <v-list-item-content>
                  <v-list-item-title>{{ station.WName }} </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-group>
          </v-list-group>

          <v-list-group prepend-icon="mdi-human-male-girl">
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title>{{ $t("section") }}</v-list-item-title>
              </v-list-item-content>
            </template>

            <v-list-group sub-group v-for="(mainClass, i) in Object.keys(sections)" :key="i">
              <template v-slot:activator>
                <v-list-item-content>
                  <v-list-item-title>{{ mainClass }}</v-list-item-title>
                </v-list-item-content>
              </template>

              <v-list-item
                v-for="(section, i) in sections[mainClass]"
                :key="i"
                exact
                :to="{ name: 'Section', params: { section: section.DpCode } }"
              >
                <v-list-item-content>
                  <v-list-item-title>{{ section.FName }} </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-group>
          </v-list-group>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <router-view />
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  name: "HomeBaseLayout",

  computed: {
    ...mapState(["homeNavigationDrawer", "stationList", "sectionList"]),
    sections() {
      const sections = [];

      for (const section of this.sectionList) {
        const mainClass = section.MainClass === "" ? this.$t("others") : section.MainClass;
        if (!(mainClass in sections)) {
          sections[mainClass] = [section];
        } else {
          sections[mainClass].push(section);
        }
      }

      return sections;
    },
    stations() {
      const stations = [];

      for (const station of this.stationList) {
        const building = station.WBuilding === "" ? this.$t("others") : station.WBuilding;
        if (!(building in stations)) {
          stations[building] = [station];
        } else {
          stations[building].push(station);
        }
      }

      return stations;
    }
  },

  async created() {
    await Promise.all([this.fetchSectionList(), this.fetchStationList()]);
  },

  methods: {
    ...mapActions(["fetchSectionList", "fetchStationList"]),
    toggleHomeNavigationDrawer(isOpen) {
      this.$store.commit("toggleHomeNavigationDrawer", isOpen);
    }
  }
};
</script>
