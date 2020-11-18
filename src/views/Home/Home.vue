<template>
  <div>
    <HomeAppBar color="primary" dark :title="pageTitle" />

    <v-container fluid>
      <v-row>
        <v-col cols="12" v-if="!isPatientListLoading">
          <PatientList :patientList="patientList" :key="todo" />
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
  name: "Home",

  components: {
    PatientList,
    HomeAppBar
  },

  data() {
    return {
      // TODO: fource patientList component update
      todo: 0,
      isPatientListLoading: false,
      patientList: null
    };
  },

  computed: {
    ...mapState(["account"]),
    pageTitle() {
      const { qryType, parameter } = this.$route.query;

      if (!qryType && !parameter) {
        return "我的關注病患";
      }

      const searchCategories = [
        { label: "科別碼", value: "SEC" },
        { label: "病床號", value: "BED" },
        { label: "病歷號", value: "MR" },
        { label: "醫師碼", value: "DR" },
        { label: "護理站代碼", value: "WARD" }
      ];
      const category = searchCategories.find(cateogry => cateogry.value === qryType)?.label || "";

      return `${category} ${parameter}`;
    }
  },

  watch: {
    $route: {
      async handler(to, from) {
        this.todo++;
        // 從病患頁過來不撈取新資料 (搭配 keep-alive cache patientList)
        if (from?.name === "PatientProfile") return;

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