import axios from "axios";
// const BASE_URL = "http://localhost:8081/api/v1/rooms";
const BASE_URL = "http://ec2-3-35-174-218.ap-northeast-2.compute.amazonaws.com:8081/api/v1/rooms";

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

const getCreateRoomResult = async (body) => {
  const result = await axios.post(`${BASE_URL}`, body);
  return result;
};

const getRoomListResult = async (body) => {
  const { sort, order, limit, offset } = body;
  const result = await axios.get(
    `${BASE_URL}/order?sort=${sort}&order=${order}&limit=${limit}&offset=${offset}`,
    body
  );
  return result;
};
const getRoomSearchResult = async (target) => {
  const result = await axios.get(`${BASE_URL}/search?keyword=${target}`);
  console.log(result);
  return result;
};

const getRoomTitle = async (roomSeq) => {
  const result = await axios.get(`${BASE_URL}/title?roomSeq=${roomSeq}`);
  console.log(result);
  return result;
};

const getRoomEnterPrivateCheckResult = async (data) => {
  const result = await axios.get(
    `${BASE_URL}/pwd?roomSeq=${data.roomSeq}&password=${data.password}`
  );
  console.log(result);
  return result;
};

const getRoomEnterResult = async (body) => {
  const result = await axios.post(`${BASE_URL}/enter`, body);
  console.log(result);
  return result;
};
const getRoomExitResult = async (body) => {
  const result = await axios.patch(`${BASE_URL}/exit`, body);
  console.log(result);
};

const setRoomSnapshotResult = async (body) => {
  console.log(body);
  const result = await axios.patch(`${BASE_URL}/img`, body);
  console.log(result);
};

const RoomApi = {
  getCreateRoomResult,
  getRoomListResult,
  getRoomSearchResult,
  getRoomEnterResult,
  getRoomEnterPrivateCheckResult,
  getRoomExitResult,
  setRoomSnapshotResult,
  getRoomTitle,
};

export default RoomApi;
