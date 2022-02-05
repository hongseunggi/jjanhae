import axios from "axios";
// const BASE_URL = "http://localhost:8081/api/v1/conferences";
const BASE_URL = "https://i6a507.p.ssafy.io/api/v1/conferences";

const getCreateRoomResult = async (body) => {
    const result = await axios.post(`${BASE_URL}`, body);
    console.log(result);
    return result;
};

const getRoomListResult = async (body) => {
    
    const result = await axios.post(`${BASE_URL}/order`, body);
    console.log(result);
    return result;
}


const RoomApi = {
    getCreateRoomResult,
    getRoomListResult
};

export default RoomApi;
