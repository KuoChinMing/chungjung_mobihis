<template>
  <v-app-bar v-bind="$attrs" v-on="$listeners">
    <v-btn icon @click="$router.go(-1)" exact>
      <v-icon>mdi-chevron-left</v-icon>
    </v-btn>

    <v-toolbar-title>{{ title }}</v-toolbar-title>
  </v-app-bar>
</template>

<script>
export default {
  name: "PatientProfileAppBar",

  props: {
    title: {
      type: String,
      default: ""
    }
  }
};
</script>
