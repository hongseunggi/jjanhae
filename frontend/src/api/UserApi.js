import axios from "axios";
const BASE_URL = "http://localhost:8081/user";
// const BASE_URL = "https://i6a507.p.ssafy.io/api/v1/user";

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
  console.log(body);
  const result = await axios.post(`${BASE_URL}/login`, body);
  console.log(result);
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
};

export default UserApi;
