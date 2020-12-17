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
import { mapGetters, mapState } from "vuex";
import HomeAppBar from "./HomeAppBar.vue";
import PatientList from "@/views/Home/PatientList.vue";
import axios from "@/plugins/axios.js";

export default {
  name: "Home",

  components: {
    PatientList,
    HomeAppBar
  },

  data() {
    return {
      isPatientListLoading: false,
      patientList: null
    };
  },

  computed: {
    ...mapState(["account"]),
    ...mapGetters(["searchCategories"]),
    pageTitle() {
      const { qryType, parameter } = this.$route.query;

      if (!qryType && !parameter) {
        return this.$t("myPatient");
      }

      // TODO: searchCategories 抽成全域
      const category =
        this.searchCategories.find(cateogry => cateogry.value === qryType)?.label || "";

      return `${category} ${parameter}`;
    }
  },

  watch: {
    $route: {
      async handler(to, from) {
        // 防止切到 patientProfile 頁面時觸發
        if (to.name !== "Home") return;
        // 從病患頁過來不撈取新資料 (搭配 keep-alive cache patientList)
        if (from?.name === "PatientProfile" && !!this.patientList) return;

        const { qryType, parameter } = to.query;
        if (qryType || parameter) {
          this.patientList = await this.getPatientList(qryType, parameter);
        } else {
          this.patientList = await this.getPatientList("DR", this.account);
        }
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
