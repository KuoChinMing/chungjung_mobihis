<template>
  <v-form name="photoUploadForm" ref="photoUploadForm" @submit.prevent="submit">
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-text-field name="mrno" outlined dense hide-details label="病歷號"></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-text-field name="patientName" outlined dense hide-details label="姓名"></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-text-field name="section" outlined dense hide-details label="科別"></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-text-field name="time" outlined dense hide-details label="時間點"></v-text-field>
        </v-col>
        <!-- TODO 照片上傳種類改成選單 select -->
        <v-col cols="12">
          <v-text-field
            name="imageType"
            outlined
            dense
            hide-details
            label="照片種類"
          ></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-text-field name="bodyPart" outlined dense hide-details label="部位器官">
          </v-text-field>
        </v-col>
        <v-col cols="12">
          <v-file-input
            name="file"
            accept="image/*"
            label="照片"
            prepend-icon=""
            outlined
            dense
            hide-details
          ></v-file-input>
        </v-col>
        <v-col cols="12" class="pb-0">
          <v-btn style="width: 100%;" color="primary" large depressed type="submit">
            <v-icon>mdi-cloud-upload</v-icon>
            <span class="ml-2">上傳</span>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script>
export default {
  name: "PhotoUploadForm",

  methods: {
    submit() {
      const form = this.$refs.photoUploadForm.$el;
      const formData = new FormData(form);

      this.$emit("submit", formData);
    }
  }
};
</script>
