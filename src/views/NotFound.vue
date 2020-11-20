<template>
  <v-app>
    <v-main>
      <v-container fill-height>
        <v-row>
          <v-col class="text-center ">
            <h4 class="text-h4 primary--text">Whoops, 404</h4>
            <p>{{ $t("pageNotFound") }}</p>
            <v-btn color="primary" outlined @click="$router.push({ name: 'Home' })">
              {{ $t("bringMeHome") }}
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "NotFound404"
};
</script>
