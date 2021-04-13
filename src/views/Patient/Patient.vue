<template>
  <div>
    <!-- TODO  病人危險值 alert  -->
    <v-app-bar color="primary" dark>
      <v-btn icon @click="$router.back()" exact>
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      <v-toolbar-title>{{ $t("medicalRecords") }}</v-toolbar-title>
    </v-app-bar>

    <v-container fluid class="fill-height">
      <!-- TODO snackbar 做成 component -->
      <v-snackbar v-model="successSnackbar" color="success" text centered>
        <v-row no-gutters align="center">
          <v-icon color="success">mdi-check-circle</v-icon>
          <span class="ml-1">上傳成功</span>
        </v-row>
        <template v-slot:action="{ attrs }">
          <v-btn color="success" text v-bind="attrs" @click="successSnackbar = false">
            關閉
          </v-btn>
        </template>
      </v-snackbar>

      <v-snackbar v-model="failSnackbar" color="error" text centered>
        <v-row no-gutters align="center">
          <v-icon color="error">mdi-check-circle</v-icon>
          <span class="ml-1">上傳失敗</span>
        </v-row>
        <template v-slot:action="{ attrs }">
          <v-btn color="red" text v-bind="attrs" @click="failSnackbar = false">
            關閉
          </v-btn>
        </template>
      </v-snackbar>

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
      </v-row>
      <v-row>
        <v-col cols="12" class="pb-12">
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

          <v-btn
            v-if="patientInfo"
            color="primary"
            class="elevation-3"
            fab
            fixed
            bottom
            right
            @click="openUploadPhotoDialog"
          >
            <v-icon>mdi-camera-plus</v-icon>
          </v-btn>
        </v-col>
      </v-row>

      <!-- TODO upload photo dialog 包成 component -->
      <!-- TODO 上傳防呆 -->
      <v-dialog v-model="isUploadPhotoDialogOpen" persistent scrollable>
        <v-card :disabled="uploadingImage" :loading="fetchingImageTags">
          <v-toolbar dense flat>
            <v-spacer></v-spacer>
            <v-icon @click="closeUploadPhotoDialog">mdi-close</v-icon>
          </v-toolbar>

          <v-divider></v-divider>

          <v-card-text style="height: 100%" class="py-0">
            <v-container fluid>
              <v-row dense v-if="images.length > 0">
                <v-col cols="auto" v-if="selectedImages.length === 0">
                  <v-btn small depressed @click="selectAll">全選</v-btn>
                </v-col>
                <v-col cols="auto" v-else>
                  <v-btn small depressed @click="clearSelect">清除所選</v-btn>
                </v-col>
                <v-spacer></v-spacer>
                <v-col cols="auto">
                  <v-switch
                    color="primary"
                    dense
                    hide-details
                    class="mt-0 caption"
                    v-model="greyMode"
                  >
                    <template #label>
                      <span class="caption font-weight-medium grey--text text--darken-3">
                        灰色模式
                      </span>
                    </template>
                  </v-switch>
                </v-col>
              </v-row>

              <v-row justify="center">
                <v-col v-for="(image, index) in images" :key="index" cols="12" sm="6" md="4" lg="3">
                  <v-card
                    wdith="100%"
                    color="grey lighten-4"
                    @click="image.selected = !image.selected"
                    :ripple="false"
                  >
                    <div class="pa-3">
                      <v-card
                        outlined
                        height="140"
                        width="100%"
                        min-width="140"
                        :color="greyMode ? 'grey lighten-4' : 'white'"
                      >
                        <img
                          :src="image.url"
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
                                  {{ image.division.name }}
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
                                  v-for="(division, index) in imageTags.division"
                                  :key="index"
                                  :value="division"
                                >
                                  <v-list-item-title>{{ division.name }}</v-list-item-title>
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
                                  {{ image.bodyPart.name }}
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
                                  v-for="(bodyPart, index) in imageTags.bodyPart"
                                  :key="index"
                                  :value="bodyPart"
                                >
                                  <v-list-item-title>{{ bodyPart.name }}</v-list-item-title>
                                </v-list-item>
                              </v-list-item-group>
                            </v-list>
                          </v-menu>
                        </v-col>
                        <v-col cols="6">
                          <v-menu offset-y>
                            <template v-slot:activator="{ on, attrs }">
                              <v-btn depressed v-bind="attrs" v-on="on" width="100%" @click.stop>
                                <span v-if="image.timePoint">
                                  {{ image.timePoint.name }}
                                </span>
                                <span v-else>
                                  {{ $t("uploadImage.timePoint") }}
                                  <v-icon small>mdi-chevron-down</v-icon>
                                </span>
                              </v-btn>
                            </template>
                            <v-list dense>
                              <v-list-item-group v-model="image.timePoint">
                                <v-list-item
                                  v-for="(timePoint, index) in imageTags.timePoint"
                                  :key="index"
                                  :value="timePoint"
                                >
                                  <v-list-item-title>{{ timePoint.name }}</v-list-item-title>
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
                                  {{ image.category.name }}
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
                                  v-for="(category, index) in imageTags.category"
                                  :key="index"
                                  :value="category"
                                >
                                  <v-list-item-title>{{ category.name }}</v-list-item-title>
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
                    min-height="100"
                  >
                    <!-- TODO label 有時候 click 不到 -->
                    <v-btn icon x-large class="elevation-2" @click="$refs.inputedImage.click()">
                      <!-- <label for="inputImage" @click.stop> -->
                      <v-icon size="24">mdi-camera-plus</v-icon>
                      <!-- </label> -->
                    </v-btn>
                  </v-card>

                  <input
                    ref="inputedImage"
                    id="inputImage"
                    class="d-none"
                    name="file"
                    accept="image/jpeg"
                    type="file"
                    multiple
                    @change="loadImage"
                  />
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions v-show="selectedImages.length > 0" style="position: relative">
            <v-btn absolute fab small elevation="3" style="top: -48px" @click="removeSeletedImage">
              <v-icon color="grey darken-1">mdi-trash-can-outline</v-icon>
            </v-btn>

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
                          v-for="(division, index) in imageTags.division"
                          :key="index"
                          :value="division"
                        >
                          <v-list-item-title>{{ division.name }}</v-list-item-title>
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
                          v-for="(bodyPart, index) in imageTags.bodyPart"
                          :key="index"
                          :value="bodyPart"
                        >
                          <v-list-item-title>{{ bodyPart.name }}</v-list-item-title>
                        </v-list-item>
                      </v-list-item-group>
                    </v-list>
                  </v-menu>
                </v-col>
                <v-col cols="3">
                  <v-menu offset-y>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn depressed v-bind="attrs" v-on="on" width="100%">
                        {{ $t("uploadImage.timePoint") }}
                        <v-icon small>mdi-chevron-down</v-icon>
                      </v-btn>
                    </template>
                    <v-list dense>
                      <v-list-item-group @change="setSelectedImagesProperty('timePoint', $event)">
                        <v-list-item
                          v-for="(timePoint, index) in imageTags.timePoint"
                          :key="index"
                          :value="timePoint"
                        >
                          <v-list-item-title>{{ timePoint.name }}</v-list-item-title>
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
                          v-for="(category, index) in imageTags.category"
                          :key="index"
                          :value="category"
                        >
                          <v-list-item-title>{{ category.name }}</v-list-item-title>
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
            <v-btn text color="primary" @click="uploadImage" :disabled="!images.length">
              {{ $t("uploadImage.upload") }}
            </v-btn>
          </v-card-actions>

          <v-overlay absolute :value="uploadingImage" opacity="0">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
          </v-overlay>
        </v-card>
      </v-dialog>
    </v-container>
  </div>
</template>

<script>
import utils from "@/utils/utils.js";
import { mapState } from "vuex";

export default {
  name: "Patient",

  computed: {
    ...mapState({
      newPatientInfo: "patientInfo",
      userId: "userId",
      imageTags: ({ uploadImage }) => uploadImage.imageTags,
      fetchedImageTag: ({ uploadImage }) => uploadImage.fetchedImageTag
    }),
    selectedImages() {
      return this.images.filter(image => image.selected);
    }
  },

  data() {
    return {
      images: [],
      greyMode: false,
      patientInfo: null,
      fetchingImageTags: false,
      isPatientInfoLoading: false,
      isUploadPhotoDialogOpen: false,
      uploadingImage: false,
      successSnackbar: false,
      failSnackbar: false
    };
  },

  async created() {
    await this.setPatientInfo();
  },

  methods: {
    removeSeletedImage() {
      this.images = this.images.filter(image => !image.selected);
    },
    clearSelect() {
      this.images.forEach(image => (image.selected = false));
    },
    selectAll() {
      this.images.forEach(image => (image.selected = true));
    },
    setSelectedImagesProperty(key, value) {
      this.selectedImages.forEach(image => (image[key] = value));
    },
    async fetchImagesTag() {
      const apiParams = {
        User: this.userId,
        Password: "password",
        PtnID: this.patientInfo.CHTNO,
        DeviceGUID: this.userId,
        MimeType: "image/jpeg"
      };

      await this.$store.dispatch("fetchImagesTag", apiParams);
    },
    async uploadImage() {
      const baseParams = {
        User: this.userId,
        // TODO
        Password: "EBM_DEMO",
        PtnID: this.patientInfo.CHTNO,
        DeviceGUID: this.userId,
        MimeType: "image/jpeg"
      };

      const uploadingImages = [];
      for (let i = 0; i < this.images.length; i++) {
        const image = new FormData();
        image.append("", this.images[i].raw);
        const { bodyPart, category, division, timePoint } = this.images[i];
        const params = {
          ...baseParams,
          BodyPart: bodyPart?.name,
          StudyDesc: category?.name,
          DepartmentName: division?.name,
          ImageComment: timePoint?.name
        };

        const uploadingImage = () => this.$store.dispatch("uploadImage", { params, image });
        uploadingImages.push(uploadingImage);
      }

      try {
        this.uploadingImage = true;
        await Promise.all(uploadingImages.map(uploadingImage => uploadingImage()));
        this.successSnackbar = true;
      } catch (error) {
        console.log(error);
        this.failSnackbar = true;
      } finally {
        this.uploadingImage = false;
        this.isUploadPhotoDialogOpen = false;
      }
    },
    async loadImage() {
      const images = this.$refs.inputedImage.files;

      for (let i = 0; i < images.length; i++) {
        const image = {
          division: null,
          timePoint: null,
          category: null,
          bodyPart: null,
          selected: false,
          url: URL.createObjectURL(images[i]),
          raw: images[i]
        };
        this.images.push(image);
      }

      // reset input value，防止第二次選取相同照片時不會觸發 @change 事件
      this.$refs.inputedImage.value = "";
    },
    async openUploadPhotoDialog() {
      this.images = [];
      this.greyMode = false;

      if (!this.fetchedImageTag) {
        try {
          this.fetchingImageTags = true;
          await this.fetchImagesTag();
          this.$store.commit("fetchedImagesTags", true);
        } catch (error) {
          console.log(error);
        } finally {
          this.fetchingImageTags = false;
        }
      }

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
