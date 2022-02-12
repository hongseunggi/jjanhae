import axios from "axios";
// const BASE_URL = "http://localhost:8081/api/v1/rooms";
const BASE_URL = "https://i6a507.p.ssafy.io/api/v1/rooms";

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

const getRoomEnterPrivateCheckResult = async (data) => {
  const result = await axios.get(`${BASE_URL}/pwd?roomSeq=${data.roomSeq}&password=${data.password}`);
  console.log(result);
  return result;
}

const getRoomEnterResult = async (body) => {
  const result = await axios.post(`${BASE_URL}/enter`, body);
  console.log(result);
  return result;
}
const getRoomExitResult = async (body) => {
  const result = await axios.patch(`${BASE_URL}/exit`, body);
  console.log(result);
}

const RoomApi = {
  getCreateRoomResult,
  getRoomListResult,
  getRoomSearchResult,
  getRoomEnterResult,
  getRoomEnterPrivateCheckResult,
  getRoomExitResult
};

export default RoomApi;
