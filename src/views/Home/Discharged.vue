<template>
  <div>
    <v-app-bar color="primary" dark>
      <v-app-bar-nav-icon @click="toggleHomeNavigationDrawer"></v-app-bar-nav-icon>
      <v-toolbar-title>{{ $t("dischargedPatient") }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon :to="{ name: 'Settings' }">
        <v-icon>mdi-settings</v-icon>
      </v-btn>
    </v-app-bar>

    <v-container fluid>
      <v-row>
        <v-col cols="12">
          <!-- TODO: 考慮 date picker 是否抽成 component -->
          <v-menu offset-y :close-on-content-click="false" max-width="290" v-model="isDateMenuOpen">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="white" rounded large v-on="on" v-bind="attrs" width="100%" height="48">
                <v-icon color="grey" style="position: absolute; left: 0;">mdi-calendar</v-icon>
                <span class="ml-2">{{ dateRangeText }}</span>
              </v-btn>
            </template>
            <v-date-picker v-model="dateRange" scrollable range locale="zh-TW"></v-date-picker>
          </v-menu>
        </v-col>
      </v-row>

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
import PatientList from "@/views/Home/PatientList.vue";
import { formatDate } from "@/utils/utils.js";
import axios from "@/plugins/axios.js";

export default {
  name: "Discharged",

  components: {
    PatientList
  },

  data() {
    return {
      isDateMenuOpen: false,
      dateRange: [],
      isPatientListLoading: false,
      patientList: null
    };
  },

  computed: {
    ...mapState(["account"]),
    dateRangeText() {
      const [startDate, endDate] = this.dateRange;

      if (startDate && endDate) return `${formatDate(startDate)} - ${formatDate(endDate)}`;
      else if (startDate) return formatDate(startDate);
      else return "";
    }
  },

  watch: {
    async dateRange() {
      if (this.dateRange[0] && this.dateRange[1]) {
        if (new Date(this.dateRange[0]) > new Date(this.dateRange[1])) {
          this.dateRange = [this.dateRange[1], this.dateRange[0]];
        }

        this.isDateMenuOpen = false;
        this.patientList = await this.getPatientList();
      }
    }
  },

  async created() {
    this.setDefaultDateRange();
  },

  methods: {
    setDefaultDateRange() {
      const formatDate = date => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const day = date
          .getDate()
          .toString()
          .padStart(2, "0");

        return `${year}-${month}-${day}`;
      };

      const endDate = new Date();
      const diffDay = 10;
      const startDate = new Date(endDate - diffDay * 24 * 60 * 60 * 1000);

      this.dateRange = [formatDate(startDate), formatDate(endDate)];
    },
    async getPatientList() {
      let patientList = [];

      try {
        this.isPatientListLoading = true;
        const params = {
          requestID: this.account,
          qryType: "DR",
          parameter: this.account,
          disFlag: "1",
          sDate: this.dateRange[0],
          eDate: this.dateRange[1]
        };
        const res = await axios.get("/api/DischargedPatient", { params });
        patientList = res.data;
      } catch (error) {
        console.log(error);
      } finally {
        this.isPatientListLoading = false;
      }

      return patientList;
    },
    toggleHomeNavigationDrawer() {
      this.$store.commit("toggleHomeNavigationDrawer", true);
    }
  }
};
</script>
