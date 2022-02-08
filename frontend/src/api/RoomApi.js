import axios from "axios";
// const BASE_URL = "http://localhost:8081/api/v1/conferences";
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

const RoomApi = {
  getCreateRoomResult,
  getRoomListResult,
  getRoomSearchResult,
};

export default RoomApi;
