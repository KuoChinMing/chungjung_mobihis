<template>
  <div>
    <HomeAppBar color="primary" dark :title="pageTitle" />

    <v-container fluid>
      <v-row>
        <v-col cols="12" v-if="!isPatientListLoading">
          <PatientList :patientList="patientList" />
        </v-col>

        <v-col cols="12" v-else>
          <div class="text-center py-3">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapState } from "vuex";
import HomeAppBar from "./HomeAppBar.vue";
import PatientList from "@/views/Home/PatientList.vue";
import axios from "@/plugins/axios.js";

export default {
  name: "Station",

  components: {
    HomeAppBar,
    PatientList
  },

  data() {
    return {
      isPatientListLoading: false,
      patientList: null
    };
  },

  computed: {
    ...mapState(["account", "stationList"]),
    pageTitle() {
      const wardNo = this.$route.params.station;
      const station = this.stationList.find(station => station.WardNo === wardNo);

      return station?.WName ? station.WName : "";
    }
  },

  watch: {
    $route: {
      async handler(to) {
        // 防止切到 patientProfile 頁面時觸發
        if (to.name !== "Station") return;

        this.patientList = await this.getPatientList("WARD", to.params.station);
      },
      immediate: true
    }
  },

  methods: {
    async getPatientList(qryType, parameter) {
      let patientList = [];

      try {
        this.isPatientListLoading = true;
        const params = { requestID: this.account, qryType, parameter };
        const res = await axios.get("/api/AdmissionPatient", { params });
        patientList = res.data;
      } catch (error) {
        console.log(error);
      } finally {
        this.isPatientListLoading = false;
      }

      return patientList;
    }
  }
};
</script>
