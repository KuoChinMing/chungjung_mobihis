<template>
  <v-form name="photoUploadForm" ref="photoUploadForm" @submit.prevent="submit">
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-text-field
            v-model="chtno"
            name="mrno"
            outlined
            dense
            hide-details
            :label="$t('patient.chtno')"
          ></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="name"
            name="patientName"
            outlined
            dense
            hide-details
            :label="$t('patient.name')"
          ></v-text-field>
        </v-col>
        <v-col cols="12">
          <!-- TODO 自動帶入登入者的科別 -->
          <v-text-field
            name="section"
            outlined
            dense
            hide-details
            :label="$t('section')"
          ></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-select
            name="time"
            outlined
            dense
            hide-details
            :label="$t('timeSection')"
            :items="timeSelectOptions"
          ></v-select>
        </v-col>
        <v-col cols="12">
          <v-select
            name="imageType"
            outlined
            dense
            hide-details
            :label="$t('imageType')"
            :items="imageTypeSelectOptions"
          ></v-select>
        </v-col>
        <v-col cols="12">
          <v-select
            name="bodyPart"
            outlined
            dense
            hide-details
            :label="$t('bodyPart')"
            :items="bodyPartSelectOptions"
          ></v-select>
        </v-col>
        <v-col cols="12">
          <v-file-input
            name="file"
            accept="image/*"
            :label="$t('image')"
            prepend-icon=""
            outlined
            dense
            hide-details
          ></v-file-input>
        </v-col>
        <v-col cols="12" class="pb-0">
          <v-btn style="width: 100%;" color="primary" large depressed type="submit">
            <v-icon>mdi-cloud-upload</v-icon>
            <span class="ml-2">{{ $t("upload") }}</span>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script>
export default {
  name: "PhotoUploadForm",

  props: {
    chtno: {
      type: String,
      default: () => "",
      required: false
    },
    name: {
      type: String,
      default: () => "",
      required: false
    }
  },

  data() {
    return {
      timeSelectOptions: ["TODO1", "TODO2", "TODO3", "TODO4", "TODO5"],
      imageTypeSelectOptions: ["TODO1", "TODO2", "TODO3", "TODO4", "TODO5"],
      bodyPartSelectOptions: ["TODO1", "TODO2", "TODO3", "TODO4", "TODO5"]
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
