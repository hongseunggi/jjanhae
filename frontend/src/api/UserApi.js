import axios from "axios";
const BASE_URL = "http://localhost:8081/api/v1/user";
// const BASE_URL = "https://i6a507.p.ssafy.io/api/v1/user";

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

// 유저관련 api 설정
const getRegistResult = async (body) => {
  const result = await axios.post(`${BASE_URL}/signup`, body);
  return result;
};

const getEmailCheckResult = async (flag, body) => {
  const result =
    flag === "regist"
      ? await axios.post(BASE_URL, body)
      : await axios.patch(`${BASE_URL}/id`, body);
  return result;
};

const getEmailCodeCheckResult = async (flag, body) => {
  const result =
    flag === "regist"
      ? await axios.get(
          `${BASE_URL}?email=${body.email}&authCode=${body.authCode}`
        )
      : await axios.get(
          `${BASE_URL}/id?name=${body.name}&email=${body.email}&authCode=${body.authCode}`
        );

  return result;
};

const getIdCheckResult = async (param) => {
  const result = await axios.get(`${BASE_URL}?userId=${param}`);
  return result;
};

const getPwdCheckResult = async (body) => {
  const result = await axios.patch(`${BASE_URL}/pwd`, body);
  return result;
};

const getPwdResetResult = async (body) => {
  const result = await axios.patch(`${BASE_URL}/newpwd`, body);
  return result;
};

const getLoginResult = async (body) => {
  console.log(axios.defaults.headers.Authorization);
  const result = await axios.post(`${BASE_URL}/login`, body);
  sessionStorage.setItem("accessToken", result.data.accessToken);
  axios.defaults.headers.Authorization =
    "Bearer " + sessionStorage.getItem("accessToken");
  console.log(axios.defaults.headers.Authorization);
  // const { accessToken } = result.data;
  // axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

  return result;
};

const getUserProfile = async () => {
  console.log(axios.defaults.headers.Authorization);
  const result = await axios.get(`${BASE_URL}/profile`);
  return result;
};

const getUpdateProfileResult = async (body) => {
  const result = await axios.patch(`${BASE_URL}/profile`, body);
  const data = getUserProfile();
  return data;
};

const getUpdateProfileImgResult = async (body) => {
  const result = await axios.patch(`${BASE_URL}/profileimg`, body);
  return result;
};

const getRoomDate = async (month) => {
  console.log(month);
  axios.defaults.headers.Authorization =
    "Bearer " + sessionStorage.getItem("accessToken");
  // const result = await axios.get(`${BASE_URL}/conferences`);
  const result = await axios.get(`${BASE_URL}/room?month=${month}`);
  return result;
};

const getRoomList = async (date) => {
  console.log("date: " + date);
  axios.defaults.headers.Authorization =
    "Bearer " + sessionStorage.getItem("accessToken");
  const result = await axios.get(`${BASE_URL}/room?date=${date}`);
  return result;
};

const getUserList = async (roomSeq) => {
  console.log("roomSeq: " + roomSeq);
  axios.defaults.headers.Authorization =
    "Bearer " + sessionStorage.getItem("accessToken");
  const result = await axios.get(`${BASE_URL}/history?roomSeq=${roomSeq}`);
  return result;
};

const UserApi = {
  getRegistResult,
  getEmailCheckResult,
  getEmailCodeCheckResult,
  getIdCheckResult,
  getPwdCheckResult,
  getPwdResetResult,
  getLoginResult,
  getUserProfile,
  getUpdateProfileResult,
  getRoomDate,
  getRoomList,
  getUpdateProfileImgResult,
  getUserList,
};

export default UserApi;
