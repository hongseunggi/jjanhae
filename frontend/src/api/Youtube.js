import axios from "axios";

class Youtube {
  constructor(key) {
    this.youtube = axios.create({
      baseURL: "https://www.googleapis.com/youtube/v3",
      params: { key: key },
    });
  }

  search = async (query) => {
    const response = await this.youtube.get("search", {
      params: {
        part: "snippet",
        q: query,
        maxResults: 10,
      },
    });
    return response.data.items;
  };
}

export default Youtube;
