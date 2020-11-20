<template>
  <v-app-bar v-bind="$attrs" v-on="$listeners">
    <v-app-bar-nav-icon @click="toggleHomeNavigationDrawer"></v-app-bar-nav-icon>

    <!-- <v-expand-x-transition> -->
    <v-toolbar-title v-show="!isCategorySearchShowing">
      {{ title }}
    </v-toolbar-title>
    <!-- </v-expand-x-transition> -->

    <v-spacer></v-spacer>

    <!-- TODO: 換頁時 categorySearch 清空， blur, focus 優化 -->
    <!-- <v-expand-x-transition> -->
    <div width="100%" v-show="isCategorySearchShowing">
      <CategorySearch
        light
        autofocus
        class="elevation-0"
        v-model="searchKeyword"
        :categories="searchCategories"
        :selectedCategory="searchSelectedCategory"
        @selectCateogry="selectCateogry"
        @search="search"
      />
    </div>
    <!-- </v-expand-x-transition> -->

    <v-btn icon @click="toggleCategorySearch" v-show="!isCategorySearchShowing">
      <v-icon>mdi-magnify</v-icon>
    </v-btn>

    <v-btn icon :to="{ name: 'Settings' }">
      <v-icon>mdi-settings</v-icon>
    </v-btn>
  </v-app-bar>
</template>

<script>
import CategorySearch from "@/components/CategorySearch.vue";
import { mapGetters } from "vuex";

export default {
  name: "HomeAppBar",

  components: {
    CategorySearch
  },

  data() {
    return {
      searchSelectedCategory: null,
      searchKeyword: "",
      isCategorySearchShowing: false
    };
  },

  props: {
    title: {
      type: String,
      default: ""
    }
  },

  computed: {
    ...mapGetters(["searchCategories"])
  },

  watch: {
    // for i18n
    searchCategories(newValue) {
      this.searchSelectedCategory = newValue[0];
    }
  },

  methods: {
    toggleCategorySearch() {
      this.isCategorySearchShowing = !this.isCategorySearchShowing;
    },
    toggleHomeNavigationDrawer() {
      this.$store.commit("toggleHomeNavigationDrawer", true);
    },
    selectCateogry(selectedCategory) {
      this.searchSelectedCategory = selectedCategory;
    },
    async search() {
      this.isCategorySearchShowing = false;
      const { qryType, parameter } = this.$route.query;

      if (!this.searchKeyword || !this.searchKeyword.trim()) return;
      if (qryType === this.searchSelectedCategory.value && parameter === this.searchKeyword) return;

      this.$router.push({
        name: "Home",
        query: { qryType: this.searchSelectedCategory.value, parameter: this.searchKeyword }
      });
    }
  }
};
</script>
