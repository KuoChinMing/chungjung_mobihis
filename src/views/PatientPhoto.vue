<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>照片上傳</v-card-title>
          <v-card-text>
            <v-btn color="primary" depressed @click="openUploadPhotoDialog">
              <v-icon>mdi-cloud-upload</v-icon>
              <span class="ml-2">照片上傳</span>
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="isUploadPhotoDialogOpen">
      <v-card>
        <v-toolbar flat>
          <v-toolbar-title>照片上傳</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-icon class="ml-auto" @click="closeUploadPhotoDialog">mdi-close</v-icon>
        </v-toolbar>
        <v-divider></v-divider>
        <v-card-text>
          <PhotoUploadForm @submit="uploadPhoto" />
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapState } from "vuex";
import PhotoUploadForm from "@/components/PhotoUploadForm.vue";
import axios from "@/plugins/axios";

export default {
  name: "PatientPhoto",

  components: {
    PhotoUploadForm
  },

  data() {
    return {
      isUploadPhotoDialogOpen: false
    };
  },

  computed: {
    ...mapState(["token"])
  },

  methods: {
    openUploadPhotoDialog() {
      this.isUploadPhotoDialogOpen = true;
    },

    closeUploadPhotoDialog() {
      this.isUploadPhotoDialogOpen = false;
    },

    async uploadPhoto(formData) {
      // for (const [key, value] of formData.entries()) {
      //   console.log(key, value);
      // }
      try {
        const res = await axios.post(`/api/UploadOP`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        console.log(res);
      } catch (error) {
        console.log(error);
      }
    }
  }
};
</script>
