import Vue from "vue";
import Vuex from "vuex";
import staticVar from "./staticVar.js";
import uploadImage from "./uploadImage.js";
import axiosOriginal from "axios";
import axios from "@/plugins/axios.js";
import jwt_decode from "jwt-decode";

Vue.use(Vuex);

const token = localStorage.getItem("token") || null;
const tokenPayload = token ? jwt_decode(token) : {};
// console.log(tokenPayload);

export default new Vuex.Store({
  state: {
    homeNavigationDrawer: false,
    token: token,
    sectionList: [],
    stationList: [],
    patientInfo: null,
    account: tokenPayload["unique_name"] || ""
  },
  getters: {
    ...staticVar.getters
  },
  mutations: {
    account(state, account) {
      state.account = account;
    },
    token(state, token) {
      state.token = token;
      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    },
    sectionList(state, sectionList) {
      state.sectionList = sectionList;
    },
    stationList(state, stationList) {
      state.stationList = stationList;
    },
    patientInfo(state, patientInfo) {
      state.patientInfo = patientInfo;
    },
    toggleHomeNavigationDrawer(state, isOpen) {
      state.homeNavigationDrawer = isOpen;
    }
  },
  actions: {
    async fetchSectionList({ commit }) {
      const { data: sectionList } = await axios.get("/api/SectionList");
      commit("sectionList", sectionList);
    },
    async fetchStationList({ commit }) {
      const { data: stationList } = await axios.get("/api/StationList");
      commit("stationList", stationList);
    },
    async fetchPatientInfo({ commit }, params) {
      const { data: patientInfo } = await axios.get("/api/PatientInfo", { params });
      commit("patientInfo", patientInfo);
    },
    async login({ commit }, { account, password }) {
      const loginParams = { userID: account, password };
      const loginResponse = await axios.get("/api/Token/Login", { params: loginParams });
      const encryptedToken = loginResponse.data.Token;
      const BASE_URL = process.env.VUE_APP_BASE_URL;
      const { data: token } = await axiosOriginal.get(`${BASE_URL}/api/Token/Decrypt`, {
        params: { text: encryptedToken }
      });

      commit("account", account);
      commit("token", token);
    }
  },
  modules: {
    uploadImage
  }
});
