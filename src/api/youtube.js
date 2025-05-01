export default class Youtube {
  constructor(apiClient) {
    this.apiClient = apiClient;
  }

  async search(keyword) {
    return keyword ? this.#searchByKeyword(keyword) : this.#mostPopular();
  }

  async channelImageURL(id) {
    const channelImgUrl = await this.apiClient
      .channels({ params: { part: 'snippet', id } })
      .then((res) => {
        return res.data.items[0].snippet.thumbnails.default.url;
      });

    return channelImgUrl;
  }

  async related(channelId) {
    const relatedVids = await this.apiClient
      .search({
        params: {
          part: 'snippet',
          channelId,
          maxResults: 25,
          order: 'date',
          type: 'video',
        },
      })
      .then((res) => res.data.items)
      .then((items) => items.map((item) => ({ ...item, id: item.id.videoId })));
    return relatedVids;
  }

  async #searchByKeyword(keyword) {
    return this.apiClient
      .search({
        params: {
          part: 'snippet',
          maxResults: 25,
          type: 'video',
          q: keyword,
          order: 'date',
        },
      })
      .then((res) => res.data.items)
      .then((items) => items.map((item) => ({ ...item, id: item.id.videoId })));
  }

  async #mostPopular() {
    return this.apiClient
      .videos({
        params: {
          part: 'snippet',
          maxResults: 25,
          chart: 'mostPopular',
        },
      })
      .then((res) => res.data.items);
  }
}
