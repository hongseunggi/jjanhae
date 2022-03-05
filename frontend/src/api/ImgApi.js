import axios from "axios";
// const BASE_URL = "http://localhost:8081/api/v1/img";
const BASE_URL = "http://ec2-3-35-174-218.ap-northeast-2.compute.amazonaws.com:8081/api/v1/img";

axios.interceptors.request.use(
  function (config) {
    const accessToken = sessionStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization =
        "Bearer " + sessionStorage.getItem("accessToken");
      console.log(config.headers.Authorization);
    }
    return config;
  },
  function (error) {
    // 요청 에러 직전 호출됩니다.
    console.log(error);
    return Promise.reject(error);
  }
);

const getImgUploadResult = async (body) => {
  const result = await axios.post(`${BASE_URL}/upload`, body);
  console.log(result);
  return result;
};

const ImgApi = {
  getImgUploadResult,
};

export default ImgApi;
