<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <!-- TODO 實作出院病患頁上方選擇日期按鈕 -->
        <v-menu offset-y :close-on-content-click="false" max-width="290">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="white" rounded large v-on="on" v-bind="attrs" width="100%" height="48">
              {{ todo }}
            </v-btn>
          </template>
          <v-date-picker v-model="todo" scrollable range></v-date-picker>
        </v-menu>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" v-if="!isPatientListAllLoading">
        <div v-if="patientListAll && patientListAll.length > 0">
          <v-tabs v-model="doctorTab" center-active show-arrows>
            <v-tab v-for="doctorTab in doctorTabs" :key="doctorTab">
              {{ doctorTab }}
            </v-tab>
          </v-tabs>

          <v-container fluid>
            <v-row>
              <v-col
                v-for="(patient, index) in patientList"
                :key="index"
                @click="
                  $router.push({
                    name: 'PatientProfile',
                    params: {
                      patientId: patient.CHTNO,
                      admissionKey: patient.AdmissionKey,
                      inHosDate: patient.InHosDate
                    }
                  })
                "
              >
                <v-card class="mx-auto" max-width="350" min-width="270">
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title class="mb-3">
                        <v-row no-gutters align="center">
                          <v-col cols="auto" class="text-body-1">
                            <span>{{ patient.BedNo }}</span>
                            <span class="ml-3">
                              <!-- :class="[patient.gender == 1 ? 'light-blue--text' : 'pink--text']" -->
                              {{ patient.CNM }}
                            </span>
                          </v-col>
                          <v-col cols="auto" class="ml-auto">
                            <v-chip
                              v-if="patient.DNRFlag == 1"
                              class="ml-1 px-2"
                              label
                              small
                              dark
                              color="pink "
                              >D</v-chip
                            >
                            <v-chip
                              v-if="patient.CriticalFlag == 1"
                              class="ml-1 px-2"
                              label
                              small
                              dark
                              color="deep-orange "
                              >C</v-chip
                            >
                            <v-chip
                              v-if="patient.DrugTag == 'True'"
                              class="ml-1 px-2"
                              label
                              small
                              dark
                              color="green"
                              >藥</v-chip
                            >
                            <v-chip
                              v-if="patient.AllergyFlag == 1"
                              class="ml-1 px-2"
                              label
                              small
                              dark
                              color="purple "
                              >敏</v-chip
                            >
                            <v-chip
                              v-if="patient.ICCardNote == 1"
                              class="ml-1 px-2"
                              label
                              small
                              dark
                              color="light-blue "
                              >註</v-chip
                            >
                            <v-chip
                              v-if="patient.DangerFlag == 1"
                              class="ml-1 px-2"
                              label
                              small
                              dark
                              color="red "
                              >危</v-chip
                            >
                            <v-chip
                              v-if="patient.RemindFlag == 1"
                              class="ml-1 px-2"
                              label
                              small
                              dark
                              color="orange "
                              >警</v-chip
                            >
                          </v-col>
                        </v-row>
                      </v-list-item-title>

                      <v-row no-gutters align="center" class="mb-3">
                        <v-col cols="auto" class="text-body-2">
                          <span>{{ patient.CHTNO }}</span>
                          <span class="ml-1">({{ fullAge(patient.age) }})</span>
                        </v-col>
                        <v-col cols="auto" class="ml-auto text-body-2">
                          <v-chip v-if="+patient.CAS >= 7" outlined small class="px-2" color="red">
                            CAS {{ patient.CAS }}
                          </v-chip>
                        </v-col>
                        <v-col cols="12" class="text-body-2">
                          <span>{{ RocToBc(patient.InHosDate) }}</span>
                        </v-col>
                      </v-row>

                      <v-list-item-subtitle>
                        <span>
                          {{ patient.VSName }} | {{ patient.RName }} |
                          {{ patient.NPName || "--" }} |
                          {{ patient.IName }}
                        </span>
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </div>
        <div v-else>
          <v-container>
            <v-row no-gutters>
              <v-col cols="12">
                <v-alert colored-border elevation="2" border="bottom" color="primary">
                  查無病患資料
                </v-alert>
              </v-col>
            </v-row>
          </v-container>
        </div>
      </v-col>

      <v-col cols="12" v-else>
        <div class="text-center py-3">
          <v-progress-circular indeterminate color="primary"></v-progress-circular>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState } from "vuex";
import axios from "@/plugins/axios.js";

export default {
  name: "Home",

  data() {
    return {
      todo: [],

      doctorTab: 0,
      isPatientListAllLoading: false,
      patientListAll: null
    };
  },

  computed: {
    ...mapState(["account"]),
    patientList() {
      const doctor = this.doctorTabs[this.doctorTab];

      if (doctor === "全部") {
        return this.patientListAll;
      }
      return this.patientListAll.filter(patient => patient.VSName === doctor);
    },
    doctorTabs() {
      const doctorTabs = [];

      doctorTabs.push("全部");
      // VSName 是主治醫師名字
      for (const patient of this.patientListAll) {
        if (!doctorTabs.includes(patient.VSName)) {
          doctorTabs.push(patient.VSName);
        }
      }

      return doctorTabs;
    }
  },

  async created() {
    this.patientListAll = await this.getPatientList();
  },

  methods: {
    async getPatientList() {
      try {
        this.isPatientListAllLoading = true;
        const params = {
          requestID: this.account,
          qryType: "DR",
          parameter: this.account,
          disFlag: "1",
          sDate: "2020/11/01",
          eDate: "2020/11/20"
        };
        const { data: patientListAll } = await axios.get("/api/DischargedPatient", { params });
        return patientListAll;
      } catch (error) {
        console.log(error);
      } finally {
        this.isPatientListAllLoading = false;
      }
    },
    RocToBc(time) {
      const year = +time.slice(0, 3) + 1911;
      const month = time.slice(3, 5);
      const date = time.slice(5, 7);

      return `${year}/${month}/${date}`;
    },
    fullAge(age) {
      return `${+age.slice(0, 3)}Y${age.slice(3, 5)}M`;
    }
  }
};
</script>
