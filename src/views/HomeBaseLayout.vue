<template>
  <div>
    <!-- TODO home app bar page title 切換 -->
    <HomeAppBar color="primary" dark :title="pageTitle"   />

    <v-navigation-drawer :value="homeNavigationDrawer" @input="toggleHomeNavigationDrawer" fixed>
      <v-list nav expand>
        <v-list-item-group color="primary">
          <v-list-item :to="{ name: 'Home' }" exact>
            <v-list-item-icon>
              <v-icon>mdi-star</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>我的關注病患</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item :to="{ name: 'Discharged' }">
            <v-list-item-icon>
              <v-icon>mdi-account-arrow-right</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>出院病患</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-group prepend-icon="mdi-hospital">
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title>
                  大樓 / 護理站
                </v-list-item-title>
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
                <v-list-item-title>科別</v-list-item-title>
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
import { mapState } from "vuex";
import HomeAppBar from "./HomeAppBar.vue";
import axios from "@/plugins/axios";

export default {
  name: "HomeBaseLayout",

  components: {
    HomeAppBar
  },

  data() {
    return {
      stations: [],
      sections: [],
      searchCategories: [
        { label: "科別碼", value: "SEC" },
        { label: "病床號", value: "BED" },
        { label: "病歷號", value: "MR" },
        { label: "醫師碼", value: "DR" },
        { label: "護理站代碼", value: "WARD" }
      ]
    };
  },

  computed: {
    ...mapState(["homeNavigationDrawer"]),
    pageTitle() {
      const { qryType, parameter } = this.$route.query;

      if (!qryType && !parameter) {
        return "我的關注病患";
      }

      const categoryText =
        this.searchCategories.find(cateogry => cateogry.value === qryType)?.label || "";
      return `${categoryText} ${parameter}`;
    }
  },

  async created() {
    const [stationList, sectionList] = await Promise.all([
      this.getStationList(),
      this.getSectionList()
    ]);
    this.stations = this.getStations(stationList);
    this.sections = this.getSections(sectionList);
  },

  methods: {
    getSections(sectionList) {
      const sections = [];

      for (const section of sectionList) {
        const mainClass = section.MainClass === "" ? "其他" : section.MainClass;
        if (!(mainClass in sections)) {
          sections[mainClass] = [section];
        } else {
          sections[mainClass].push(section);
        }
      }

      return sections;
    },
    getStations(stationList) {
      const stations = [];

      for (const station of stationList) {
        const building = station.WBuilding === "" ? "其他" : station.WBuilding;
        if (!(building in stations)) {
          stations[building] = [station];
        } else {
          stations[building].push(station);
        }
      }

      return stations;
    },
    async getSectionList() {
      const { data: sectionList } = await axios.get("/api/SectionList");
      return sectionList;
    },
    async getStationList() {
      const { data: stationList } = await axios.get("/api/StationList");
      return stationList;
    },
    toggleHomeNavigationDrawer(isOpen) {
      this.$store.commit("toggleHomeNavigationDrawer", isOpen);
    }
  }
};
</script>
