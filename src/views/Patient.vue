<template>
  <div>
    <PatientAppBar color="primary" dark title="病患病例" />

    <v-container fluid>
      <v-row>
        <v-col cols="12">
          <v-card outlined>
            <v-tabs center-active show-arrows>
              <v-tab :to="{ name: 'PatientProfile' }" exact>檢歷</v-tab>
              <v-tab :to="{ name: 'PatientVitalSign' }" exact>生命徵象</v-tab>
              <v-tab :to="{ name: 'PatientLab' }" exact>檢驗報告</v-tab>
              <v-tab :to="{ name: 'PatientImage' }" exact>影像調閱</v-tab>
              <v-tab :to="{ name: 'PatientExam' }" exact>檢查報告</v-tab>
              <v-tab :to="{ name: 'NotFound' }" exact>特殊檢查</v-tab>
              <v-tab :to="{ name: 'NotFound' }" exact>各類報告</v-tab>
              <v-tab :to="{ name: 'NotFound' }" exact>病理報告</v-tab>
              <v-tab :to="{ name: 'NotFound' }" exact>住院用藥</v-tab>
              <v-tab :to="{ name: 'NotFound' }" exact>住院病例</v-tab>
              <v-tab :to="{ name: 'PatientPhoto' }" exact>照片上傳</v-tab>
              <v-tab :to="{ name: 'NotFound' }" exact>醫師註記</v-tab>
              <v-tab :to="{ name: 'NotFound' }" exact>院內連結</v-tab>
              <v-tab :to="{ name: 'NotFound' }" exact>會診紀錄</v-tab>
            </v-tabs>

            <v-divider></v-divider>

            <router-view />
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import PatientAppBar from "@/views/PatientAppBar.vue";

export default {
  name: "Patient",

  components: {
    PatientAppBar
  }
};
</script>
