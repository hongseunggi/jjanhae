import axios from "axios";
const BASE_URL = "http://localhost:8081/api/v1/conferences";
// const BASE_URL = "https://i6a507.p.ssafy.io/api/v1/user";
axios.defaults.headers.Authorization = "Bearer "+sessionStorage.getItem("accessToken");

const getCreateRoomResult = async (body) => {
    const result = await axios.post(`${BASE_URL}`, body);
    console.log(result);
    return result;
};

const RoomApi = {
    getCreateRoomResult
};

export default RoomApi;
