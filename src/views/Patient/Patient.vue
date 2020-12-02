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
      <v-dialog v-model="isUploadPhotoDialogOpen" persistent scrollable>
        <v-card>
          <v-toolbar dense flat>
            <v-spacer></v-spacer>
            <v-icon @click="closeUploadPhotoDialog">mdi-close</v-icon>
          </v-toolbar>

          <v-divider></v-divider>

          <v-card-text style="height: 100%" class="py-0">
            <v-container fluid>
              <!-- <v-row dense>
              <v-col>
                <v-switch class="float-right mt-0" dense hide-details>color</v-switch>
              </v-col>
            </v-row> -->

              <v-row justify="center">
                <v-col v-for="(image, index) in images" :key="index" cols="12" sm="6" md="4" lg="3">
                  <v-card
                    wdith="100%"
                    color="grey lighten-4"
                    @click="image.selected = !image.selected"
                    :ripple="false"
                  >
                    <div class="pa-3">
                      <v-card outlined height="140" width="100%" min-width="140">
                        <img
                          :src="image.base64"
                          style=" width: 100%; height: 100%; object-fit: contain"
                        />
                        <v-badge
                          v-show="image.selected"
                          bordered
                          color="primary"
                          icon="mdi-check"
                          offset-x="12"
                          offset-y="-126"
                        ></v-badge>
                      </v-card>
                    </div>

                    <v-container>
                      <v-row dense>
                        <v-col cols="6">
                          <v-menu offset-y>
                            <template v-slot:activator="{ on, attrs }">
                              <v-btn depressed v-bind="attrs" v-on="on" width="100%" @click.stop>
                                <span v-if="image.division">
                                  {{ image.division.label }}
                                </span>
                                <span v-else>
                                  {{ $t("uploadImage.division") }}
                                  <v-icon small>mdi-chevron-down</v-icon>
                                </span>
                              </v-btn>
                            </template>
                            <v-list dense>
                              <v-list-item-group v-model="image.division">
                                <v-list-item
                                  v-for="(division, index) in division"
                                  :key="index"
                                  :value="division"
                                >
                                  <v-list-item-title>{{ division.label }}</v-list-item-title>
                                </v-list-item>
                              </v-list-item-group>
                            </v-list>
                          </v-menu>
                        </v-col>
                        <v-col cols="6">
                          <v-menu offset-y>
                            <template v-slot:activator="{ on, attrs }">
                              <v-btn depressed v-bind="attrs" v-on="on" width="100%" @click.stop>
                                <span v-if="image.bodyPart">
                                  {{ image.bodyPart.label }}
                                </span>
                                <span v-else>
                                  {{ $t("uploadImage.bodyPart") }}
                                  <v-icon small>mdi-chevron-down</v-icon>
                                </span>
                              </v-btn>
                            </template>
                            <v-list dense>
                              <v-list-item-group v-model="image.bodyPart">
                                <v-list-item
                                  v-for="(bodyPart, index) in bodyPart"
                                  :key="index"
                                  :value="bodyPart"
                                >
                                  <v-list-item-title>{{ bodyPart.label }}</v-list-item-title>
                                </v-list-item>
                              </v-list-item-group>
                            </v-list>
                          </v-menu>
                        </v-col>
                        <v-col cols="6">
                          <v-menu offset-y>
                            <template v-slot:activator="{ on, attrs }">
                              <v-btn depressed v-bind="attrs" v-on="on" width="100%" @click.stop>
                                <span v-if="image.timepoint">
                                  {{ image.timepoint.label }}
                                </span>
                                <span v-else>
                                  {{ $t("uploadImage.timepoint") }}
                                  <v-icon small>mdi-chevron-down</v-icon>
                                </span>
                              </v-btn>
                            </template>
                            <v-list dense>
                              <v-list-item-group v-model="image.timepoint">
                                <v-list-item
                                  v-for="(timepoint, index) in timepoint"
                                  :key="index"
                                  :value="timepoint"
                                >
                                  <v-list-item-title>{{ timepoint.label }}</v-list-item-title>
                                </v-list-item>
                              </v-list-item-group>
                            </v-list>
                          </v-menu>
                        </v-col>
                        <v-col cols="6">
                          <v-menu offset-y>
                            <template v-slot:activator="{ on, attrs }">
                              <v-btn depressed v-bind="attrs" v-on="on" width="100%" @click.stop>
                                <span v-if="image.category">
                                  {{ image.category.label }}
                                </span>
                                <span v-else>
                                  {{ $t("uploadImage.category") }}
                                  <v-icon small>mdi-chevron-down</v-icon>
                                </span>
                              </v-btn>
                            </template>
                            <v-list dense>
                              <v-list-item-group v-model="image.category">
                                <v-list-item
                                  v-for="(category, index) in category"
                                  :key="index"
                                  :value="category"
                                >
                                  <v-list-item-title>{{ category.label }}</v-list-item-title>
                                </v-list-item>
                              </v-list-item-group>
                            </v-list>
                          </v-menu>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card>
                </v-col>
                <v-col cols="12" sm="6" md="4" lg="3">
                  <v-card
                    flat
                    class="d-flex justify-center align-center"
                    height="100%"
                    width="100%"
                    min-height="140"
                  >
                    <v-btn icon x-large class="elevation-2">
                      <label for="inputImage">
                        <v-icon size="24">mdi-camera-plus</v-icon>
                      </label>
                    </v-btn>
                  </v-card>

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
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions v-show="selectedImages.length > 0">
            <v-container class="pa-0">
              <v-row dense class="ma-0">
                <v-col cols="3">
                  <v-menu offset-y>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn depressed v-bind="attrs" v-on="on" width="100%">
                        {{ $t("uploadImage.division") }}
                        <v-icon small>mdi-chevron-down</v-icon>
                      </v-btn>
                    </template>
                    <v-list dense>
                      <v-list-item-group @change="setSelectedImagesProperty('division', $event)">
                        <v-list-item
                          v-for="(division, index) in division"
                          :key="index"
                          :value="division"
                        >
                          <v-list-item-title>{{ division.label }}</v-list-item-title>
                        </v-list-item>
                      </v-list-item-group>
                    </v-list>
                  </v-menu>
                </v-col>
                <v-col cols="3">
                  <v-menu offset-y>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn depressed v-bind="attrs" v-on="on" width="100%">
                        {{ $t("uploadImage.bodyPart") }}
                        <v-icon small>mdi-chevron-down</v-icon>
                      </v-btn>
                    </template>
                    <v-list dense>
                      <v-list-item-group @change="setSelectedImagesProperty('bodyPart', $event)">
                        <v-list-item
                          v-for="(bodyPart, index) in bodyPart"
                          :key="index"
                          :value="bodyPart"
                        >
                          <v-list-item-title>{{ bodyPart.label }}</v-list-item-title>
                        </v-list-item>
                      </v-list-item-group>
                    </v-list>
                  </v-menu>
                </v-col>
                <v-col cols="3">
                  <v-menu offset-y>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn depressed v-bind="attrs" v-on="on" width="100%">
                        {{ $t("uploadImage.timepoint") }}
                        <v-icon small>mdi-chevron-down</v-icon>
                      </v-btn>
                    </template>
                    <v-list dense>
                      <v-list-item-group @change="setSelectedImagesProperty('timepoint', $event)">
                        <v-list-item
                          v-for="(timepoint, index) in timepoint"
                          :key="index"
                          :value="timepoint"
                        >
                          <v-list-item-title>{{ timepoint.label }}</v-list-item-title>
                        </v-list-item>
                      </v-list-item-group>
                    </v-list>
                  </v-menu>
                </v-col>
                <v-col cols="3">
                  <v-menu offset-y>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn depressed v-bind="attrs" v-on="on" width="100%">
                        {{ $t("uploadImage.category") }}
                        <v-icon small>mdi-chevron-down</v-icon>
                      </v-btn>
                    </template>
                    <v-list dense>
                      <v-list-item-group @change="setSelectedImagesProperty('category', $event)">
                        <v-list-item
                          v-for="(category, index) in category"
                          :key="index"
                          :value="category"
                        >
                          <v-list-item-title>{{ category.label }}</v-list-item-title>
                        </v-list-item>
                      </v-list-item-group>
                    </v-list>
                  </v-menu>
                </v-col>
              </v-row>
            </v-container>
          </v-card-actions>

          <v-divider v-show="selectedImages.length > 0"></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="uploadImage">
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
    }),
    selectedImages() {
      return this.images.filter(image => image.selected);
    }
  },

  data() {
    return {
      division: [{ label: "sec1" }, { label: "sec2" }],
      bodyPart: [{ label: "頭" }, { label: "手" }],
      timepoint: [{ label: "早上" }, { label: "下午" }],
      category: [{ label: "傷口治療前傷口治療前" }, { label: "X-ray" }],
      images: [],
      patientInfo: null,
      isPatientInfoLoading: false,
      isUploadPhotoDialogOpen: false
    };
  },

  async created() {
    await this.setPatientInfo();
  },

  methods: {
    setSelectedImagesProperty(key, value) {
      this.selectedImages.forEach(image => {
        image[key] = value;
      });
    },
    uploadImage() {
      const apiUrl = "http://asia.ebmtech.com/StoreVideo/StoreImageAndVideo.ashx";

      const params = {
        User: this.account,
        Password: "password",
        PtnID: this.patientInfo.CHTNO,
        DeviceGUID: this.account,
        MimeType: "image/jpeg"
      };

      axiosOriginal.post(apiUrl, "1234", { params });
    },
    async loadImage() {
      const images = this.$refs.inputedImage.files;

      const imageToBase64 = async image => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(image);
          reader.onload = () => {
            resolve(reader.result);
          };
          reader.onError = reject;
        });
      };

      for (let i = 0; i < images.length; i++) {
        const base64 = await imageToBase64(images[i]);
        console.log(URL.createObjectURL(images[i]));
        const image = {
          division: null,
          timepoint: null,
          category: null,
          bodyPart: null,
          selected: false,
          // base64: URL.createObjectURL(images[i])
          base64
        };
        this.images.push(image);
      }
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
