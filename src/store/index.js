import Vue from "vue";
import Vuex from "vuex";
import staticVar from "./staticVar.js";
import uploadImage from "./uploadImage.js";
import axiosOriginal from "axios";
import axios from "@/plugins/axios.js";
// import jwt_decode from "jwt-decode";

Vue.use(Vuex);

// 解 jwtToken 拿 token payload
// const token = localStorage.getItem("token") || null;
// const tokenPayload = token ? jwt_decode(token) : {};
// console.log(tokenPayload);

export default new Vuex.Store({
  state: {
    token: localStorage.getItem("token") || null,
    userId: localStorage.getItem("userId") || "",
    sectionList: [],
    stationList: [],
    patientInfo: null,
    homeNavigationDrawer: false
    // account: tokenPayload["unique_name"] || "",
  },
  getters: {
    ...staticVar.getters
  },
  mutations: {
    userId(state, userId) {
      state.userId = userId;
      localStorage.setItem("userId", userId);
    },
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
    async decrypt(_, encryptedData) {
      const BASE_URL = GLOBAL_CONFIG.BASE_URL; // eslint-disable-line no-undef
      return await axiosOriginal.get(`${BASE_URL}/api/Token/Decrypt`, {
        params: { text: encryptedData }
      });
    },
    async login({ commit, dispatch }, { account, password }) {
      const loginParams = { userID: account, password };
      const { data: loginResponse } = await axios.get("/api/Token/Login", { params: loginParams });
      const { Token: encryptedToken, ID: encryptedId } = loginResponse;
      const [{ data: token }, { data: userId }] = await Promise.all([
        dispatch("decrypt", encryptedToken),
        dispatch("decrypt", encryptedId)
      ]);

      commit("account", account);
      commit("userId", userId);
      commit("token", token);
    }
  },
  modules: {
    uploadImage
  }
});
