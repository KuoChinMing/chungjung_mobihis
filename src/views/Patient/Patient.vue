<template>
  <div>
    <v-app-bar color="primary" dark>
      <v-btn icon @click="$router.back()" exact>
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      <v-toolbar-title>{{ $t("medicalRecords") }}</v-toolbar-title>
    </v-app-bar>

    <v-container fluid class="fill-height">
      <v-row>
        <v-col cols="12" v-if="!isPatientInfoLoading">
          <div class="pl-3" v-if="patientInfo">
            <h2 class="d-inline-block">{{ patientInfo.CNM || "--" }}</h2>
            <span class="ml-2 text-body-1">
              {{ gender(patientInfo.Gender) }} ({{ fullAge(patientInfo.Age) }})
            </span>
            <div>
              <span class="text-body-1">
                {{ $t("patient.chtno") }}: {{ patientInfo.CHTNO || "--" }}
              </span>
              <span class="ml-2  text-body-1">
                {{ $t("bedNumber") }}: {{ patientInfo.BedNo || "--" }}
              </span>
            </div>
            <div>
              <span class="text-body-1">
                {{ $t("admittedDay") }}: {{ RocToBc(patientInfo.InHosDate) }}
              </span>
              <span class="ml-2 text-body-1">
                {{ $t("dischargedDay") }}: {{ RocToBc(patientInfo.OutDate) }}
              </span>
            </div>
          </div>
        </v-col>
        <v-col cols="12" v-else>
          <div class="text-center">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-tabs center-active show-arrows>
            <v-tab :to="{ name: 'PatientProfile', params: $route.params }" replace exact>
              {{ $t("patientProfile.patientProfile") }}
            </v-tab>
            <v-tab :to="{ name: 'PatientPhoto', params: $route.params }" replace exact>
              {{ $t("uploadPhoto") }}
            </v-tab>
            <!-- <v-tab :to="{ name: 'NotFound' }" exact>生命徵象</v-tab>
            <v-tab :to="{ name: 'NotFound' }" exact>檢驗報告</v-tab>
            <v-tab :to="{ name: 'NotFound' }" exact>影像調閱</v-tab>
            <v-tab :to="{ name: 'NotFound' }" exact>檢查報告</v-tab>
            <v-tab :to="{ name: 'NotFound' }" exact>特殊檢查</v-tab>
            <v-tab :to="{ name: 'NotFound' }" exact>各類報告</v-tab>
            <v-tab :to="{ name: 'NotFound' }" exact>病理報告</v-tab>
            <v-tab :to="{ name: 'NotFound' }" exact>住院用藥</v-tab>
            <v-tab :to="{ name: 'NotFound' }" exact>住院病例</v-tab>
            <v-tab :to="{ name: 'NotFound' }" exact>醫師註記</v-tab>
            <v-tab :to="{ name: 'NotFound' }" exact>院內連結</v-tab>
            <v-tab :to="{ name: 'NotFound' }" exact>會診紀錄</v-tab> -->
          </v-tabs>

          <keep-alive>
            <router-view />
          </keep-alive>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import utils from "@/utils/utils.js";
import { mapState } from "vuex";

export default {
  name: "Patient",

  computed: {
    ...mapState({ newPatientInfo: "patientInfo" })
  },

  data() {
    return {
      patientInfo: null,
      isPatientInfoLoading: false
    };
  },

  async created() {
    await this.setPatientInfo();
  },

  methods: {
    async setPatientInfo() {
      try {
        const admissionKey = this.$route.params.admissionKey;
        const params = { admissionKey };
        this.isPatientInfoLoading = true;
        await this.$store.dispatch("fetchPatientInfo", params);
        this.patientInfo = this.newPatientInfo;
      } catch (error) {
        console.log(error);
      } finally {
        this.isPatientInfoLoading = false;
      }
    },
    gender: utils.gender,
    fullAge: utils.fullAge,
    RocToBc: utils.RocToBc
  }
};
</script>
