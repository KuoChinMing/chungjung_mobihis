<template>
  <div>
    <HomeAppBar color="primary" dark title="我的關注病患" />
    <HomeNavigationDrawer
      :value="homeNavigationDrawer"
      @input="toggleHomeNavigationDrawer"
      fixed
    ></HomeNavigationDrawer>

    <v-container fluid>
      <v-row>
        <v-col cols="12">
          <CategorySearch
            v-model="searchKeyword"
            :categories="searchCategories"
            @selectCateogry="selectCateogry"
            @search="search"
          />
        </v-col>

        <v-col cols="12">
          <v-card outlined>
            <v-tabs center-active show-arrows>
              <v-tab>全部</v-tab>
              <v-tab>醫師 1 號</v-tab>
              <v-tab>醫師 2 號</v-tab>
              <v-tab>醫師 3 號</v-tab>
              <v-tab>醫師 4 號</v-tab>
            </v-tabs>

            <v-divider></v-divider>

            <v-container fluid>
              <v-row>
                <v-col
                  v-for="(patient, index) in patientList"
                  :key="index"
                  @click="
                    $router.push({ name: 'PatientProfile', params: { patientId: patient.CHTNO } })
                  "
                >
                  <v-card class="mx-auto" max-width="400" min-width="240">
                    <v-list-item>
                      <v-list-item-content>
                        <v-list-item-title class="mb-3">
                          <v-row no-gutters align="center">
                            <v-col cols="auto" class="text-body-1">
                              <span>{{ patient.BedNo }}</span>
                              <span class="ml-3">
                                <!-- :class="[patient.gender == 1 ? 'light-blue--text' : 'pink--text']" -->
                                {{ patient.CNM }}
                              </span>
                            </v-col>
                            <v-col cols="auto" class="ml-auto">
                              <v-chip
                                v-if="patient.DNRFlag == 1"
                                class="ml-1 px-2"
                                label
                                small
                                dark
                                color="pink "
                                >D</v-chip
                              >
                              <v-chip
                                v-if="patient.CriticalFlag == 1"
                                class="ml-1 px-2"
                                label
                                small
                                dark
                                color="deep-orange "
                                >C</v-chip
                              >
                              <v-chip
                                v-if="patient.DrugTag == 'True'"
                                class="ml-1 px-2"
                                label
                                small
                                dark
                                color="green"
                                >藥</v-chip
                              >
                              <v-chip
                                v-if="patient.AllergyFlag == 1"
                                class="ml-1 px-2"
                                label
                                small
                                dark
                                color="purple "
                                >敏</v-chip
                              >
                              <v-chip
                                v-if="patient.ICCardNote == 1"
                                class="ml-1 px-2"
                                label
                                small
                                dark
                                color="light-blue "
                                >註</v-chip
                              >
                              <v-chip
                                v-if="patient.DangerFlag == 1"
                                class="ml-1 px-2"
                                label
                                small
                                dark
                                color="red "
                                >危</v-chip
                              >
                              <v-chip
                                v-if="patient.RemindFlag == 1"
                                class="ml-1 px-2"
                                label
                                small
                                dark
                                color="orange "
                                >警</v-chip
                              >
                            </v-col>
                          </v-row>
                        </v-list-item-title>

                        <v-row no-gutters align="center" class="mb-3">
                          <v-col cols="auto" class="text-body-2">
                            <span>{{ patient.CHTNO }}</span>
                            <span class="ml-1">({{ fullAge(patient.age) }})</span>
                          </v-col>
                          <v-col cols="auto" class="ml-auto text-body-2">
                            <v-chip v-if="patient.CAS" outlined small class="px-2" color="red">
                              CAS {{ patient.CAS }}
                            </v-chip>
                            <time class="ml-1" datetime="2018-07-07">2018/07/07</time>
                          </v-col>
                        </v-row>

                        <v-list-item-subtitle>
                          <span>
                            {{ patient.VSName }} | {{ patient.RName }} |
                            {{ patient.NPName || "--" }} |
                            {{ patient.IName }}
                          </span>
                        </v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                  </v-card>
                </v-col>
              </v-row>
            </v-container>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapState } from "vuex";
import HomeNavigationDrawer from "./HomeNavigationDrawer.vue";
import HomeAppBar from "./HomeAppBar.vue";
import CategorySearch from "@/components/CategorySearch.vue";
import axios from "@/plugins/axios.js";

export default {
  name: "Home",

  components: {
    HomeNavigationDrawer,
    HomeAppBar,
    CategorySearch
  },

  data() {
    return {
      patientList: [],

      searchSelectedCategory: null,
      searchKeyword: "",
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
    ...mapState(["homeNavigationDrawer", "token", "account"])
  },

  async created() {
    const params = { requestID: this.account, qryType: "DR", parameter: this.account };
    const { data: patientList } = await axios.get("/api/AdmissionPatient", { params });
    this.patientList = patientList;
    console.log(this.patientList);
  },

  methods: {
    fullAge(age) {
      return `${+age.slice(0, 3)}Y${age.slice(3, 5)}M`;
    },
    selectCateogry(selectedCategory) {
      this.searchSelectedCategory = selectedCategory;
    },
    search() {
      console.log("search");
    },
    toggleHomeNavigationDrawer(isOpen) {
      this.$store.commit("toggleHomeNavigationDrawer", isOpen);
    }
  }
};
</script>
