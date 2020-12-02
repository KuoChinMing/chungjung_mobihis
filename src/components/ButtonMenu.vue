<template>
  <v-menu offset-y>
    <template v-slot:activator="{ on, attrs }">
      <v-btn depressed v-bind="attrs" v-on="on" width="100%">
        <span v-if="selectedSection">{{ selectedSection.label }}</span>
        <span v-else>科別</span>
        <!-- <v-icon small>mdi-chevron-down</v-icon> -->
      </v-btn>
    </template>
    <v-list dense>
      <v-list-item-group v-model="selectedSection">
        <v-list-item v-for="(section, index) in sections" :key="index" :value="section">
          <v-list-item-title>{{ section.label }}</v-list-item-title>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-menu>
</template>

<script>
export default {
  
};
</script>
