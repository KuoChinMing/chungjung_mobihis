<template>
  <v-form name="photoUploadForm" ref="photoUploadForm" @submit.prevent="submit">
    <v-container>
      <!-- TODO 照片上傳自動帶入病人資訊 -->
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
          <v-select
            name="time"
            outlined
            dense
            hide-details
            label="時間點"
            :items="timeSelectOptions"
          ></v-select>
        </v-col>
        <v-col cols="12">
          <v-select
            name="imageType"
            outlined
            dense
            hide-details
            label="照片種類"
            :items="imageTypeSelectOptions"
          ></v-select>
        </v-col>
        <v-col cols="12">
          <v-select
            name="bodyPart"
            outlined
            dense
            hide-details
            label="部位器官"
            :items="bodyPartSelectOptions"
          ></v-select>
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

  data() {
    return {
      timeSelectOptions: ["手術前", "手術中", "手術後", "門診", "病房"],
      imageTypeSelectOptions: [
        "傷口治療前",
        "傷口治療後",
        "造口治療前",
        "造口治療後",
        "手術中",
        "植入物",
        "X-ray",
        "Angio",
        "導航",
        "手術計畫",
        "皮瓣"
      ],
      bodyPartSelectOptions: [
        "頭部",
        "右上肢",
        "右下肢",
        "左上肢",
        "左下肢",
        "軀幹",
        "背部",
        "腹部",
        "心臟",
        "肺臟",
        "膀胱"
      ]
    };
  },

  methods: {
    submit() {
      const form = this.$refs.photoUploadForm.$el;
      const formData = new FormData(form);

      this.$emit("submit", formData);
    }
  }
};
</script>
