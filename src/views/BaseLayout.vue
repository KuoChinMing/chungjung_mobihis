<template>
  <v-app>
    <v-main>
      <keep-alive include="HomeBaseLayout">
        <router-view />
      </keep-alive>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "BaseLayout"
};
</script>
