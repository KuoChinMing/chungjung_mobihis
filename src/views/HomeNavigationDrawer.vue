<template>
  <v-navigation-drawer v-bind="$attrs" v-on="$listeners">
    <v-list nav>
      <v-list-item-group color="primary">
        <v-list-item :to="{ name: 'Home' }" exact>
          <v-list-item-icon>
            <v-icon>mdi-star</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>我的關注病患</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item :to="{ name: 'Discharged' }">
          <v-list-item-icon>
            <v-icon>mdi-account-arrow-right</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>出院病患</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-group prepend-icon="mdi-stairs">
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title>樓層</v-list-item-title>
            </v-list-item-content>
          </template>

          <v-list-item
            v-for="(stairs, i) in ['todo1', 'todo2', 'todo3', 'todo4']"
            :key="i"
            exact
            :to="{ name: 'Stairs', params: { stairs } }"
          >
            <v-list-item-content>
              <v-list-item-title v-text="stairs"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>

        <v-list-group prepend-icon="mdi-human-male">
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title>科別</v-list-item-title>
            </v-list-item-content>
          </template>

          <v-list-item
            v-for="(sector, i) in ['todo1', 'todo2', 'todo3', 'todo4']"
            :key="i"
            link
            exact
            :to="{ name: 'Sector', params: { sector } }"
          >
            <v-list-item-content>
              <v-list-item-title v-text="sector"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
      </v-list-item-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: "HomeNavigationDrawer"
};
</script>
