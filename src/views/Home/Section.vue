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
  name: "Section",

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
    ...mapState(["userId", "sectionList"]),
    pageTitle() {
      const dpCode = this.$route.params.section;
      const section = this.sectionList.find(section => section.DpCode === dpCode);

      return section?.FName ? section.FName : "";
    }
  },

  watch: {
    $route: {
      async handler(to) {
        // 防止切到 patientProfile 頁面時觸發
        if (to.name !== "Section") return;

        this.patientList = await this.getPatientList("SEC", to.params.section);
      },
      immediate: true
    }
  },

  methods: {
    async getPatientList(qryType, parameter) {
      let patientList = [];

      try {
        this.isPatientListLoading = true;
        const params = { requestID: this.userId, qryType, parameter };
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
