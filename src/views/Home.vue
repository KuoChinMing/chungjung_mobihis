<template>
  <div>
    <HomeAppBar color="primary" dark :title="appBarTitle" />
    <HomeNavigationDrawer
      :value="homeNavigationDrawer"
      @input="toggleHomeNavigationDrawer"
      absolute
    ></HomeNavigationDrawer>

    <v-container fluid>
      <v-row>
        <v-col cols="12">
          <CategorySearch
            v-model="searchKeyword"
            :categories="searchCategories"
            @selectCateogry="selectCateogry"
            @search="search"
          />
        </v-col>

        <v-col cols="12">
          <v-card>
            <v-tabs center-active show-arrows>
              <v-tab>醫師 1 號</v-tab>
              <v-tab>醫師 2 號</v-tab>
              <v-tab>醫師 3 號</v-tab>
              <v-tab>醫師 4 號</v-tab>
            </v-tabs>
          </v-card>
        </v-col>

        <v-col v-for="i in 10" :key="i">
          <v-card class="mx-auto" max-width="344" outlined>
            <v-list-item three-line>
              <v-list-item-content>
                <div class="overline mb-4">
                  OVERLINE
                </div>
                <v-list-item-title class="headline mb-1">
                  Headline 5
                </v-list-item-title>
                <v-list-item-subtitle
                  >Greyhound divisely hello coldly fonwderfully</v-list-item-subtitle
                >
              </v-list-item-content>

              <v-list-item-avatar tile size="80" color="grey"></v-list-item-avatar>
            </v-list-item>

            <v-card-actions>
              <v-btn outlined rounded text>
                Button
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapState } from "vuex";
import HomeNavigationDrawer from "./HomeNavigationDrawer.vue";
import HomeAppBar from "./HomeAppBar.vue";
import CategorySearch from "@/components/CategorySearch.vue";
import axios from "@/plugins/axios.js";

export default {
  name: "Home",

  components: {
    HomeNavigationDrawer,
    HomeAppBar,
    CategorySearch
  },

  data() {
    return {
      appBarTitle: "我的關注病患",
      searchSelectedCategory: null,
      searchKeyword: "",
      searchCategories: [
        { label: "科別碼", value: "SEC" },
        { label: "病床號", value: "BED" },
        { label: "病歷號", value: "MR" },
        { label: "醫師碼", value: "DR" },
        { label: "護理站代碼", value: "WARD" }
      ]
    };
  },

  computed: {
    ...mapState(["homeNavigationDrawer", "token", "account"])
  },

  async created() {
    const params = { requestID: this.account, qryType: "DR", parameter: this.account };
    const res = await axios.get("/api/AdmissionPatient", { params });
    console.log(res);
  },

  methods: {
    selectCateogry(selectedCategory) {
      this.searchSelectedCategory = selectedCategory;
    },
    search() {
      console.log("search");
    },
    toggleHomeNavigationDrawer(isOpen) {
      this.$store.commit("toggleHomeNavigationDrawer", isOpen);
    }
  }
};
</script>
