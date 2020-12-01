<template>
  <!-- <v-container fluid>
    <v-row>
      <v-col cols="12"> -->
  <v-card v-if="!isDangerLoading" flat>
    <v-container fluid v-if="danger">
      <v-row>
        <v-col cols="12">
          <div class="text-subtitle-1 font-weight-bold">
            {{ $t("patientProfile.issueList") }}
          </div>
          <span class="text-body-2">{{ danger.ProblemList || "--" }}</span>
        </v-col>
        <v-col cols="12">
          <div class="text-subtitle-1 font-weight-bold">
            {{ $t("patientProfile.mainDiagnosis") }}
          </div>
          <span class="text-body-2">{{ danger.MainDiagnosis || "--" }} </span>
        </v-col>
        <v-col cols="12">
          <div class="text-subtitle-1 font-weight-bold">
            {{ $t("patientProfile.subDiagnosis") }}
          </div>
          <span class="text-body-2">{{ danger.SubDiagnosis || "--" }} </span>
        </v-col>
        <v-col cols="6">
          <div class="text-subtitle-1 font-weight-bold">
            {{ $t("patientProfile.bodyHeight") }}
          </div>
          <span class="text-body-2">{{ danger.BodyHeight || "--" }} cm</span>
        </v-col>
        <v-col cols="6">
          <div class="text-subtitle-1 font-weight-bold">
            {{ $t("patientProfile.bodyWeight") }}
          </div>
          <span class="text-body-2">{{ danger.BodyWeight || "--" }} kg</span>
        </v-col>
        <v-col cols="6">
          <div class="text-subtitle-1 font-weight-bold">
            {{ $t("admittedDay") }}
          </div>
          <span class="text-body-2">TODO</span>
        </v-col>
        <v-col cols="6">
          <div class="text-subtitle-1 font-weight-bold">{{ $t("dischargedDay") }}</div>
          <span class="text-body-2">TODO</span>
        </v-col>
        <v-col cols="12" sm="6">
          <div class="text-subtitle-1 font-weight-bold">
            {{ $t("patientProfile.patientSafetyNotification") }} -
            {{ $t("patientProfile.danger") }}
          </div>
          <span class="text-body-2">{{ danger.Danger || "--" }}</span>
        </v-col>
        <v-col cols="12" sm="6">
          <div class="text-subtitle-1 font-weight-bold">
            {{ $t("patientProfile.patientSafetyNotification") }} -
            {{ $t("patientProfile.remind") }}
          </div>
          <span class="text-body-2">{{ danger.Remind || "--" }}</span>
        </v-col>
        <v-col cols="12" sm="6">
          <div class="text-subtitle-1 font-weight-bold">
            {{ $t("patientProfile.patientSafetyNotification") }} -
            {{ $t("patientProfile.cas") }}
          </div>
          <span v-if="danger.CAS_EvaluationItem">
            <div
              class="text-body-2"
              v-for="item in danger.CAS_EvaluationItem.split('\r\n')"
              :key="item"
            >
              {{ item }}
            </div>
          </span>
          <span v-else>--</span>
        </v-col>
        <v-col cols="12" sm="6">
          <div class="text-subtitle-1 font-weight-bold">
            {{ $t("patientProfile.patientSafetyNotification") }} -
            {{ $t("patientProfile.drugAlert") }}
          </div>
          <!-- TODO 接資料 -->
          <span class="text-body-2">TODO</span>
        </v-col>
        <v-col cols="12" sm="6">
          <div class="text-subtitle-1 font-weight-bold">
            {{ $t("patientProfile.specialNote") }} - {{ $t("patientProfile.allergyHistory") }}
          </div>
          <span class="text-body-2">{{ danger.Allergy || "--" }}</span>
        </v-col>
        <v-col cols="12" sm="6">
          <div class="text-subtitle-1 font-weight-bold">
            {{ $t("patientProfile.specialNote") }} -
            {{ $t("patientProfile.catastrophicIllness") }}
          </div>
          <span class="text-body-2">{{ danger.MajorInjuries || "--" }}</span>
        </v-col>
        <v-col cols="12" sm="6">
          <div class="text-subtitle-1 font-weight-bold">
            {{ $t("patientProfile.specialNote") }} - {{ $t("patientProfile.dnr") }}
          </div>
          <span class="text-body-2">{{ danger.DNR || "--" }}</span>
        </v-col>
        <v-col cols="12" sm="6">
          <div class="text-subtitle-1 font-weight-bold">
            {{ $t("patientProfile.specialNote") }} - {{ $t("patientProfile.icCard") }}
          </div>
          <span class="text-body-2">{{ danger.ICCardNote || "--" }}</span>
        </v-col>
        <v-col cols="12" sm="6">
          <div class="text-subtitle-1 font-weight-bold">
            {{ $t("patientProfile.notification") }}
          </div>
          <!-- TODO 接資料 -->
          <span class="text-body-2">TODO</span>
        </v-col>
      </v-row>
    </v-container>
  </v-card>

  <div v-else class="text-center py-3">
    <v-progress-circular indeterminate color="primary"></v-progress-circular>
  </div>
  <!-- </v-col>
    </v-row>
  </v-container> -->
</template>

<script>
import axios from "@/plugins/axios.js";
import { mapState } from "vuex";

export default {
  name: "PatientProfile",

  data() {
    return {
      danger: null,
      isDangerLoading: false
    };
  },

  computed: {
    ...mapState(["account", "patientInfo"])
  },

  watch: {
    async patientInfo() {
      try {
        this.isDangerLoading = true;
        const patientProfile = await this.getPatientProfile();
        this.danger = patientProfile.Danger;
      } catch (error) {
        console.log(error);
      } finally {
        this.isDangerLoading = false;
      }
    }
  },

  methods: {
    async getPatientProfile() {
      // const params = { requestID: this.account, chtno: patientId, admissionKey };
      // const res = await axios.get("/api/PatientDanger", { params });
      const { CHTNO: chtno, AdmissionKey: admission, InHosDate: hosDate } = this.patientInfo;
      const params = { requestID: this.account, chtno, admission, hosDate };
      const { data: patientProfile } = await axios.get("/api/PatientSummary", { params });

      return patientProfile;
    }
  }
};
</script>
