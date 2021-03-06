import axios from "axios";

const axiosInstrance = axios.create({
  baseURL: GLOBAL_CONFIG.BASE_URL // eslint-disable-line no-undef
});

async function EncryptData(data) {
  const EncryptedObj = JSON.parse(JSON.stringify(data));
  const BASE_URL = GLOBAL_CONFIG.BASE_URL; // eslint-disable-line no-undef
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
    if (config.params) {
      config.params = await EncryptData(config.params);
    }
    return config;
  },
  function(error) {
    return Promise.reject(error);
  }
);

const token = localStorage.getItem("token") || null;
if (token) {
  axiosInstrance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

export default axiosInstrance;
