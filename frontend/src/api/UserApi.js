import axios from "axios";

// 유저관련 api 설정

const getRegistResult = async ({ URL, data }) => {
  await axios.post(URL, data);
};
