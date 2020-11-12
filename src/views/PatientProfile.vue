<template>
  <div>
    <h1>PatientProfile</h1>
  </div>
</template>

<script>
import axios from "@/plugins/axios.js";
import { mapState } from "vuex";

export default {
  name: "PatientProfile",

  created() {
    this.getPatientProfile();
  },

  computed: {
    ...mapState(["account"])
  },

  methods: {
    async getPatientProfile() {
      const { patientId, admissionKey } = this.$route.params;
      const params = { requestID: this.account, chtno: patientId, admissionKey };
      console.log(params);
      const res = await axios.get("/api/PatientDanger", { params });
      console.log(res);
    }
  }
};
</script>
