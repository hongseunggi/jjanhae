import axios from "axios";

class Youtube {
  constructor(key) {
    this.youtube = axios.create({
      baseURL: "https://www.googleapis.com/youtube/v3",
      params: { key: key },
    });
  }

  mostPopular = async () => {
    const response = await this.youtube.get("videos", {
      params: {
        part: "snippet",
        chart: "mostPopular",
        maxResults: 25,
      },
    });

    return response.data.items;
  };

  search = async (query) => {
    const response = await this.youtube.get("search", {
      params: {
        part: "snippet",
        q: query,
        maxResults: 1,
      },
    });
    return response.data.items;
  };
}

export default Youtube;
