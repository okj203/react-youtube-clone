import axios from 'axios';

export default class FakeYoutubeClient {
  async search({ params }) {
    const vids = await axios.get(
      `/videos/${params.channelId ? 'related' : 'search'}.json`
    );
    return vids
  }

  async videos() {
    return axios.get('/videos/popular.json');
  }

  async channels() {
    return axios.get(`/videos/channel.json`);
  }
}
