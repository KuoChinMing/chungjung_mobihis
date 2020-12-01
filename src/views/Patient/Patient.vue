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
          <div v-if="patientInfo">
            <div class="d-flex align-center">
              <h2 class="d-inline-block">{{ patientInfo.CNM || "--" }}</h2>
              <span class="ml-2 text-body-1">
                {{ gender(patientInfo.Gender) }} ({{ fullAge(patientInfo.Age) }})
              </span>
            </div>
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
        <!-- TODO image 排版 -->
        <v-col cols="12" v-if="patientInfo">
          <div>
            <v-btn icon color="primary" large class="elevation-3" @click="openUploadPhotoDialog">
              <v-icon size="24">mdi-camera-plus</v-icon>
            </v-btn>
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <!-- <v-tabs center-active show-arrows>
            <v-tab :to="{ name: 'PatientProfile', params: $route.params }" replace exact>
              {{ $t("patientProfile.patientProfile") }}
            </v-tab>
            <v-tab :to="{ name: 'PatientPhoto', params: $route.params }" replace exact>
              {{ $t("uploadPhoto") }}
            </v-tab>
            <v-tab :to="{ name: 'NotFound' }" exact>生命徵象</v-tab>
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
            <v-tab :to="{ name: 'NotFound' }" exact>會診紀錄</v-tab>
          </v-tabs> -->

          <keep-alive>
            <router-view />
          </keep-alive>
        </v-col>
      </v-row>

      <!-- TODO upload photo dialog 包成 component -->
      <v-dialog v-model="isUploadPhotoDialogOpen" max-width="520" persistent>
        <v-card>
          <v-toolbar dense flat>
            <v-spacer></v-spacer>
            <v-icon @click="closeUploadPhotoDialog">mdi-close</v-icon>
          </v-toolbar>

          <v-window v-model="uploadImageStep">
            <v-window-item :value="1">
              <v-container fluid>
                <!-- <v-row dense>
              <v-col>
                <v-switch class="float-right mt-0" dense hide-details>color</v-switch>
              </v-col>
            </v-row> -->
                <v-row>
                  <v-col cols="6" sm="4" v-for="(image, index) in base64Images" :key="index">
                    <v-card
                      class="mx-auto"
                      style="width: 100%;"
                      color="white"
                      height="140px"
                      @mouseover="showDeleteButton"
                    >
                      <img :src="image" style=" width: 100%; height: 100%; object-fit: contain" />
                      <v-badge
                        bordered
                        color="primary"
                        icon="mdi-check"
                        left
                        offset-x="-4"
                        offset-y="-4"
                      >
                      </v-badge>
                    </v-card>
                  </v-col>
                  <v-col cols="6" sm="4">
                    <label for="inputImage">
                      <v-card
                        class="mx-auto d-flex justify-center align-center"
                        style="width: 100%;"
                        color="grey lighten-4"
                        height="140px"
                      >
                        <v-icon>mdi-camera-plus</v-icon>
                      </v-card>
                    </label>
                    <input
                      ref="inputedImage"
                      id="inputImage"
                      class="d-none"
                      name="file"
                      accept="image/*"
                      type="file"
                      multiple
                      @change="loadImage"
                    />
                  </v-col>
                </v-row>
              </v-container>
            </v-window-item>

            <v-window-item :value="2">
              <v-container>
                <v-row v-if="patientInfo">
                  <v-col> </v-col>
                  <v-col cols="6">
                    <v-menu offset-y>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn text v-bind="attrs" v-on="on">
                          <span v-if="selectedSection">{{ selectedSection.label }}</span>
                          <span v-else>科別</span>
                          <v-icon small>mdi-chevron-down</v-icon>
                        </v-btn>
                      </template>
                      <v-list dense>
                        <v-list-item-group v-model="selectedSection">
                          <v-list-item
                            v-for="(section, index) in sections"
                            :key="index"
                            :value="section"
                          >
                            <v-list-item-title>{{ section.label }}</v-list-item-title>
                          </v-list-item>
                        </v-list-item-group>
                      </v-list>
                    </v-menu>
                  </v-col>
                </v-row>
              </v-container>
            </v-window-item>
          </v-window>

          <v-card-actions>
            <v-btn text v-show="uploadImageStep > 1" @click="uploadImageStep--">
              {{ $t("uploadImage.previos") }}
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn text v-show="uploadImageStep < 2" @click="uploadImageStep++">
              <!-- TODO button disalbled -->
              <!-- :disabled="!base64Images.length" -->
              {{ $t("uploadImage.next") }}
            </v-btn>
            <v-btn text v-show="uploadImageStep === 2" @click="uploadImage">
              {{ $t("uploadImage.upload") }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </div>
</template>

<script>
import utils from "@/utils/utils.js";
import { mapState } from "vuex";
import axiosOriginal from "axios";

export default {
  name: "Patient",

  computed: {
    ...mapState({
      newPatientInfo: "patientInfo",
      account: "account"
    })
  },

  data() {
    return {
      sections: [
        {
          label: "sec1"
        },
        {
          label: "sec2"
        }
      ],
      selectedSection: null,
      uploadImageStep: 1,
      base64Images: [],
      patientInfo: null,
      isPatientInfoLoading: false,
      isUploadPhotoDialogOpen: false
    };
  },

  async created() {
    await this.setPatientInfo();
  },

  methods: {
    showDeleteButton() {},
    uploadImage() {
      const apiUrl = "http://asia.ebmtech.com/StoreVideo/StoreImageAndVideo.ashx";

      const params = {
        User: this.account,
        Password: "password",
        PtnID: this.patientInfo.CHTNO,
        DeviceGUID: this.account,
        MimeType: "image/jpeg"
      };

      axiosOriginal.post(apiUrl, null, { params });
    },
    async loadImage() {
      const files = this.$refs.inputedImage.files;
      const base64Images = [];

      // async
      // const readImage = async file => {
      //   return new Promise((resolve, reject) => {
      //     const reader = new FileReader();
      //     reader.readAsDataURL(file);
      //     reader.onload = () => {
      //       resolve(reader.result);
      //     };
      //     reader.onError = reject;
      //   });
      // };

      // const readingFile = () => {
      //   const test = [];
      //   for (let i = 0; i < files.length; i++) {
      //     test.push(readImage(files[i]));
      //   }
      //   return test;
      // };
      // console.log(readingFile());
      // const results = await Promise.all(readingFile());
      // console.log(results);

      // sync
      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        reader.readAsDataURL(files[i]);
        reader.onload = () => {
          const base64data = reader.result;
          base64Images.push(base64data);
        };
      }

      this.base64Images = base64Images;
    },
    openUploadPhotoDialog() {
      this.isUploadPhotoDialogOpen = true;
    },
    closeUploadPhotoDialog() {
      this.isUploadPhotoDialogOpen = false;
    },
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
