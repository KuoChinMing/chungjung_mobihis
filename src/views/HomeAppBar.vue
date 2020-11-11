<template>
  <v-app-bar v-bind="$attrs" v-on="$listeners">
    <v-app-bar-nav-icon @click="toggleHomeNavigationDrawer"></v-app-bar-nav-icon>
    
    <v-toolbar-title>{{ title }}</v-toolbar-title>

    <v-spacer></v-spacer>

    <v-btn icon :to="{ name: 'Settings' }">
      <v-icon>mdi-settings</v-icon>
    </v-btn>
  </v-app-bar>
</template>

<script>
export default {
  name: "HomeAppBar",

  props: {
    title: {
      type: String,
      default: ""
    }
  },

  methods: {
    toggleHomeNavigationDrawer() {
      this.$store.commit("toggleHomeNavigationDrawer", true);
    }
  }
};
</script>
