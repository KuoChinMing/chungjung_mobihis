import axiosOriginal from "axios";
/* eslint-disable no-unused-vars */
const uploadImage = {
  state() {
    return {
      fetchedImageTag: false,
      imageTags: {}
    };
  },

  mutations: {
    imageTags(state, imageTags) {
      state.imageTags = imageTags;
    },
    fetchedImagesTags({ fetchedImageTag }, value) {
      fetchedImageTag = value;
    }
  },

  actions: {
    async fetchImagesTag({ commit }, params) {
      const url = "http://asia.ebmtech.com/StoreVideo/StoreImageAndVideo.ashx";
      const { data: imageTags } = await axiosOriginal.get(url, params);
      commit("imageTags", imageTags);
    },
    async uploadImage(_, { params, image }) {
      const url = "http://asia.ebmtech.com/StoreVideo/StoreImageAndVideo.ashx";
      const config = {
        method: "post",
        url,
        params,
        headers: { "Content-Type": "image/jpeg" },
        data: image
      };

      await axiosOriginal(config);
    }
  }
};

export default uploadImage;
/* eslint-enable no-unused-vars */
