<template>
  <div>
    <PatientAppBar color="primary" dark title="病患病例" />

    <v-container fluid class="fill-height">
      <v-row>
        <v-col cols="12" v-if="!isPatientInfoLoading">
          <div class="pl-3" v-if="patientInfo">
            <h2 class="d-inline-block">{{ patientInfo.CNM || "--" }}</h2>
            <span class="ml-2 text-body-1">
              {{ gender(patientInfo.Gender) }} ({{ fullAge(patientInfo.Age) }})
            </span>
            <div>
              <span class="text-body-1">病歷號: {{ patientInfo.CHTNO || "--" }}</span>
              <span class="ml-2  text-body-1">病床號: {{ patientInfo.BedNo || "--" }}</span>
            </div>
            <div>
              <!-- TODO 入院日 出院日與 danger 對不起來 -->
              <span class="text-body-1">入院日: {{ RocToBc(patientInfo.InHosDate) }} </span>
              <span class="ml-2 text-body-1">出院日: {{ RocToBc(patientInfo.OutDate) }}</span>
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
              病患首頁
            </v-tab>
            <v-tab :to="{ name: 'PatientPhoto', params: $route.params }" replace exact>
              照片上傳
            </v-tab>
            <v-tab :to="{ name: 'PatientVitalSign', params: $route.params }" replace exact>
              生命徵象
            </v-tab>
            <v-tab :to="{ name: 'PatientLab', params: $route.params }" replace exact>
              檢驗報告
            </v-tab>
            <v-tab :to="{ name: 'PatientImage', params: $route.params }" replace exact>
              影像調閱
            </v-tab>
            <v-tab :to="{ name: 'PatientExam', params: $route.params }" replace exact>
              檢查報告
            </v-tab>
            <v-tab :to="{ name: 'NotFound' }" exact>特殊檢查</v-tab>
            <v-tab :to="{ name: 'NotFound' }" exact>各類報告</v-tab>
            <v-tab :to="{ name: 'NotFound' }" exact>病理報告</v-tab>
            <v-tab :to="{ name: 'NotFound' }" exact>住院用藥</v-tab>
            <v-tab :to="{ name: 'NotFound' }" exact>住院病例</v-tab>
            <!-- <v-tab :to="{ name: 'PatientPhoto' }" exact>照片上傳</v-tab> -->
            <v-tab :to="{ name: 'NotFound' }" exact>醫師註記</v-tab>
            <v-tab :to="{ name: 'NotFound' }" exact>院內連結</v-tab>
            <v-tab :to="{ name: 'NotFound' }" exact>會診紀錄</v-tab>
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
import PatientAppBar from "@/views/Patient/PatientAppBar.vue";
import utils from "@/utils/utils.js";
import { mapState } from "vuex";

export default {
  name: "Patient",

  components: {
    PatientAppBar
  },

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
