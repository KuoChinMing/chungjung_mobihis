import axios from "axios";

const axiosInstrance = axios.create({
  baseURL: process.env.VUE_APP_BASE_URL
});

async function EncryptData(data) {
  const EncryptedObj = JSON.parse(JSON.stringify(data));

  const BASE_URL = process.env.VUE_APP_BASE_URL;
  const encrypting = data => async () =>
    await axios.get(`${BASE_URL}/api/Token/Crypt`, { params: { text: data } });
  const encryptingData = Object.values(EncryptedObj).map(data => encrypting(data));
  const encryptedData = (await Promise.all(encryptingData.map(encrypting => encrypting()))).map(
    res => res.data
  );

  for (const property in EncryptedObj) {
    const index = Object.keys(EncryptedObj).indexOf(property);
    EncryptedObj[property] = encryptedData[index];
  }

  return EncryptedObj;
}

// 所有 request 參數都要先加密
axiosInstrance.interceptors.request.use(
  async function(config) {
    config.params = await EncryptData(config.params);
    return config;
  },
  function(error) {
    return Promise.reject(error);
  }
);

// TODO: response 401 router push login
// axiosInstrance.interceptors.response.use(
//   async function(res) {
//     if (res.status === 401) {
//       router.push({ name: "Login" });
//     }
//     return res;
//   },
//   function(error) {
//     return Promise.reject(error);
//   }
// );

const token = localStorage.getItem("token") || null;
if (token) {
  axiosInstrance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

export default axiosInstrance;
