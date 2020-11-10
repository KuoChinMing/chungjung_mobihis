<template>
  <v-navigation-drawer v-bind="$attrs" v-on="$listeners">
    <v-list nav>
      <v-list-item-group v-model="todo" color="primary">
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>我的關注病患</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>出院病患</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>樓層</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>科別</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: "HomeNavigationDrawer",

  data() {
    return {
      todo: null
    };
  }
};
</script>
