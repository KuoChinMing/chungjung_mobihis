<template>
  <v-text-field rounded solo hide-details v-on="$listeners" v-bind="$attrs" @keyup.enter="search">
    <template v-slot:prepend-inner>
      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn text v-bind="attrs" v-on="on">
            {{ selectedCategory.label }}
            <v-icon small>mdi-chevron-down</v-icon>
          </v-btn>
        </template>
        <v-list dense>
          <v-list-item-group v-model="selectedCategory">
            <v-list-item v-for="(category, index) in categories" :key="index" :value="category">
              <v-list-item-title>{{ category.label }}</v-list-item-title>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-menu>
    </template>
    <template v-slot:append>
      <v-icon @click="search">mdi-magnify</v-icon>
    </template>
  </v-text-field>
</template>

<script>
export default {
  props: {
    categories: {
      type: Array,
      default: () => [
        {
          label: "",
          value: null
        }
      ],
      required: true
    }
  },

  data() {
    return {
      selectedCategory: null
    };
  },

  created() {
    this.selectedCategory = this.categories[0];
  },

  watch: {
    selectedCategory(selectedCategory) {
      this.$emit("selectCateogry", JSON.parse(JSON.stringify(selectedCategory)));
    }
  },

  methods: {
    search() {
      this.$emit("search");
    }
  }
};
</script>

<style></style>
