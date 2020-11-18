<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-card v-if="danger">
          <v-container fluid>
            <v-row>
              <v-col cols="12">
                <div class="text-subtitle-1 font-weight-bold">問題列表</div>
                <span class="text-body-2">{{ danger.ProblemList || "--" }}</span>
              </v-col>
              <v-col cols="12">
                <div class="text-subtitle-1 font-weight-bold">主診斷</div>
                <span class="text-body-2">{{ danger.MainDiagnosis || "--" }} </span>
              </v-col>
              <v-col cols="12">
                <div class="text-subtitle-1 font-weight-bold">次診斷</div>
                <span class="text-body-2">{{ danger.SubDiagnosis || "--" }} </span>
              </v-col>
              <v-col cols="6">
                <div class="text-subtitle-1 font-weight-bold">身高</div>
                <span class="text-body-2">{{ danger.BodyHeight || "--" }} cm</span>
              </v-col>
              <v-col cols="6">
                <div class="text-subtitle-1 font-weight-bold">體重</div>
                <span class="text-body-2">{{ danger.BodyWeight || "--" }} kg</span>
              </v-col>
              <v-col cols="6">
                <div class="text-subtitle-1 font-weight-bold">入院日</div>
                <span class="text-body-2">2020/10/29</span>
              </v-col>
              <v-col cols="6">
                <div class="text-subtitle-1 font-weight-bold">出院日</div>
                <span class="text-body-2">2020/08/26</span>
              </v-col>
              <v-col cols="12" sm="6">
                <div class="text-subtitle-1 font-weight-bold">
                  病安提示訊息-檢驗危險值
                </div>
                <span class="text-body-2">{{ danger.Danger || "--" }}</span>
              </v-col>
              <v-col cols="12" sm="6">
                <div class="text-subtitle-1 font-weight-bold">
                  病安提示訊息-檢驗警示值
                </div>
                <span class="text-body-2">{{ danger.Remind || "--" }}</span>
              </v-col>
              <v-col cols="12" sm="6">
                <div class="text-subtitle-1 font-weight-bold">
                  病安提示訊息-臨床警訊(CAS)
                </div>
                <div
                  class="text-body-2"
                  v-for="item in danger.CAS_EvaluationItem.split('\r\n')"
                  :key="item"
                >
                  {{ item }}
                </div>
              </v-col>
              <v-col cols="12" sm="6">
                <div class="text-subtitle-1 font-weight-bold">
                  病安提示訊息-用藥安全警示
                </div>
                <span class="text-body-2">查無資料</span>
              </v-col>
              <v-col cols="12" sm="6">
                <div class="text-subtitle-1 font-weight-bold">特別註記-過敏記錄</div>
                <span class="text-body-2">{{ danger.Allergy || "--" }}</span>
              </v-col>
              <v-col cols="12" sm="6">
                <div class="text-subtitle-1 font-weight-bold">特別註記-重大傷病</div>
                <span class="text-body-2">{{ danger.MajorInjuries || "--" }}</span>
              </v-col>
              <v-col cols="12" sm="6">
                <div class="text-subtitle-1 font-weight-bold">特別註記-DNR</div>
                <span class="text-body-2">{{ danger.DNR || "--" }}</span>
              </v-col>
              <v-col cols="12" sm="6">
                <div class="text-subtitle-1 font-weight-bold">特別註記-IC卡</div>
                <span class="text-body-2">{{ danger.ICCardNote || "--" }}</span>
              </v-col>
              <v-col cols="12" sm="6">
                <div class="text-subtitle-1 font-weight-bold">已推播訊息</div>
                <span class="text-body-2">無新的推播訊息</span>
              </v-col>
            </v-row>
          </v-container>
        </v-card>

        <div v-else class="text-center py-3">
          <v-progress-circular indeterminate color="primary"></v-progress-circular>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "@/plugins/axios.js";
import { mapState } from "vuex";

export default {
  name: "PatientProfile",

  data() {
    return {
      danger: null
    };
  },

  async created() {
    const patientProfile = await this.getPatientProfile();
    this.danger = patientProfile.Danger;
  },

  computed: {
    ...mapState(["account", "hosDate"])
  },

  methods: {
    async getPatientProfile() {
      const { patientId, admissionKey, inHosDate } = this.$route.params;
      // const params = { requestID: this.account, chtno: patientId, admissionKey };
      // const res = await axios.get("/api/PatientDanger", { params });
      const params = {
        requestID: this.account,
        chtno: patientId,
        admission: admissionKey,
        hosDate: inHosDate
      };
      const { data: patientProfile } = await axios.get("/api/PatientSummary", { params });
      return patientProfile;
    }
  }
};
</script>
