<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <h1>PatientPhoto</h1>
      </v-col>
      <v-col cols="12">
        <!-- TODO dialog layout -->
      </v-col>
      <v-col cols="auto">
        <ButtonUploadImage text="上傳" color="primary" depressed />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ButtonUploadImage from "@/components/ButtonUploadImage.vue";

export default {
  name: "PatientPhoto",

  components: {
    ButtonUploadImage
  }
};
</script>
