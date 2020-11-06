<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-spacer></v-spacer>
      <LogoutButton />
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import LogoutButton from "@/components/LogoutButton.vue";

export default {
  name: "BaseLayout",

  components: {
    LogoutButton
  }
};
</script>
