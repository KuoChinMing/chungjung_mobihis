<template>
  <div>
    <div v-if="innerPatientList.length > 0">
      <v-tabs v-model="doctorTab" show-arrows center-active>
        <v-tab v-for="doctorTab in doctorTabs" :key="doctorTab">
          {{ doctorTab }}
        </v-tab>
      </v-tabs>

      <v-container fluid>
        <v-row>
          <v-col
            v-for="(patient, index) in patientListByDoctor"
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
                          color="deep-orange"
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
                      {{ patient.VSName }} | {{ patient.RName }} | {{ patient.NPName || "--" }} |
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
  </div>
</template>

<script>
export default {
  name: "PatientList",

  props: {
    // 與 API /api/DischargedPatient, /api/AdmissionPatient 資料高度相依
    patientList: {
      type: Array,
      default: () => [],
      require: false
    }
  },

  data() {
    return {
      doctorTab: 0,
      innerPatientList: this.patientList ? this.patientList : []
    };
  },

  watch: {
    patientList(newValue) {
      this.innerPatientList = newValue ? newValue : [];
    }
  },

  computed: {
    patientListByDoctor() {
      const doctor = this.doctorTabs[this.doctorTab];

      if (doctor === "全部") {
        return this.innerPatientList;
      }
      return this.innerPatientList.filter(patient => patient.VSName === doctor);
    },
    doctorTabs() {
      const doctorTabs = [];

      if (this.innerPatientList.length > 0) {
        doctorTabs.push("全部");
      }
      // VSName 是主治醫師名字, 用醫生名稱判斷尚有重複的問題
      for (const patient of this.innerPatientList) {
        if (!doctorTabs.includes(patient.VSName)) {
          doctorTabs.push(patient.VSName);
        }
      }

      return doctorTabs;
    }
  },

  methods: {
    fullAge(age) {
      return `${+age.slice(0, 3)}Y${age.slice(3, 5)}M`;
    },
    RocToBc(time) {
      const year = +time.slice(0, 3) + 1911;
      const month = time.slice(3, 5);
      const date = time.slice(5, 7);

      return `${year}/${month}/${date}`;
    }
  }
};
</script>
