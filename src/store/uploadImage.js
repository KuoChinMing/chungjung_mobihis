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
      const url = GLOBAL_CONFIG.UPLOAD_IMAGE_URL; // eslint-disable-line no-undef
      const { data: imageTags } = await axiosOriginal.get(url, params);
      commit("imageTags", imageTags);
    },
    async uploadImage(_, { params, image }) {
      const url = GLOBAL_CONFIG.UPLOAD_IMAGE_URL; // eslint-disable-line no-undef
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
