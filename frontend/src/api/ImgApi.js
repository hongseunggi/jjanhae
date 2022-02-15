import axios from "axios";
const BASE_URL = "http://localhost:8081/api/v1/img";
// const BASE_URL = "https://i6a507.p.ssafy.io/api/v1/img";

const getImgUploadResult = async (body) => {
    const result = await axios.post(`${BASE_URL}/upload`, body);
    console.log(result);
    return result;
};

const ImgApi = {
    getImgUploadResult
};

export default ImgApi;
