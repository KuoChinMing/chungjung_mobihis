<template>
  <div>
    <PatientAppBar color="primary" dark title="病患病例" />

    <v-container fluid class="fill-height">
      <v-row>
        <v-col cols="12">
          <div class="pl-3">
            <h2 class="d-inline-block">山下智久</h2>
            <span class="ml-2 text-body-1"> 男 (74Y11M)</span>
            <div>
              <span class="text-body-1">病床號: 1234</span>
              <span class="ml-2 text-body-1">病歷號: {{ $route.params.patientId }}</span>
            </div>
            <div>
              <span>TODO: 上面的是假資料</span>
            </div>
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-tabs center-active show-arrows>
            <v-tab :to="{ name: 'PatientProfile', params: $route.params }" exact>
              病患首頁
            </v-tab>
            <v-tab :to="{ name: 'PatientPhoto', params: $route.params }" exact>照片上傳</v-tab>
            <v-tab :to="{ name: 'PatientVitalSign', params: $route.params }" exact>生命徵象</v-tab>
            <v-tab :to="{ name: 'PatientLab', params: $route.params }" exact>檢驗報告</v-tab>
            <v-tab :to="{ name: 'PatientImage', params: $route.params }" exact>影像調閱</v-tab>
            <v-tab :to="{ name: 'PatientExam', params: $route.params }" exact>檢查報告</v-tab>
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
import PatientAppBar from "@/views/PatientAppBar.vue";

export default {
  name: "Patient",

  components: {
    PatientAppBar
  }
};
</script>
