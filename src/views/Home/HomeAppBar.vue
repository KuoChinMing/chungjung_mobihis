<template>
  <v-app-bar v-bind="$attrs" v-on="$listeners">
    <v-app-bar-nav-icon @click="toggleHomeNavigationDrawer"></v-app-bar-nav-icon>

    <!-- <v-expand-x-transition> -->
    <v-toolbar-title v-show="!isCategorySearchShowing">{{ title }}</v-toolbar-title>
    <!-- </v-expand-x-transition> -->

    <v-spacer></v-spacer>

    <!-- <v-expand-x-transition> -->
    <div width="100%" v-show="isCategorySearchShowing">
      <CategorySearch
        light
        v-model="searchKeyword"
        :categories="searchCategories"
        :selectedCategory="searchSelectedCategory"
        @selectCateogry="selectCateogry"
        @search="search"
        class="elevation-0"
      />
    </div>
    <!-- </v-expand-x-transition> -->

    <v-btn icon @click="isCategorySearchShowing = true" v-show="!isCategorySearchShowing">
      <v-icon>mdi-magnify</v-icon>
    </v-btn>

    <v-btn icon :to="{ name: 'Settings' }">
      <v-icon>mdi-settings</v-icon>
    </v-btn>
  </v-app-bar>
</template>

<script>
import CategorySearch from "@/components/CategorySearch.vue";

export default {
  name: "HomeAppBar",

  components: {
    CategorySearch
  },

  data() {
    return {
      searchSelectedCategory: null,
      searchKeyword: "",
      isCategorySearchShowing: false,
      searchCategories: [
        { label: "科別碼", value: "SEC" },
        { label: "病床號", value: "BED" },
        { label: "病歷號", value: "MR" },
        { label: "醫師碼", value: "DR" },
        { label: "護理站代碼", value: "WARD" }
      ]
    };
  },

  props: {
    title: {
      type: String,
      default: ""
    }
  },

  methods: {
    toggleHomeNavigationDrawer() {
      this.$store.commit("toggleHomeNavigationDrawer", true);
    },
    selectCateogry(selectedCategory) {
      this.searchSelectedCategory = selectedCategory;
    },
    async search() {
      this.isCategorySearchShowing = false;
      if (!this.searchKeyword || !this.searchKeyword.trim()) return;

      this.$router.push({
        name: "Home",
        query: { qryType: this.searchSelectedCategory.value, parameter: this.searchKeyword }
      });
    }
  }
};
</script>
