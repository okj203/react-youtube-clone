# React YouTube Clone

**[🌐 Live Demo](https://okj203-react-youtube-clone.netlify.app/)**

A single-page application (SPA) built with React, implementing core functionalities of YouTube using the official [YouTube Data API v3](https://developers.google.com/youtube/v3).

## 1. Overview

This minimalist YouTube clone features a landing page with trending videos, keyword-based search functionality, and individual video detail pages with embedded playback, channel information, and related content. Video data is fetched from the YouTube API and rendered in a responsive UI designed with Tailwind CSS.

![react-youtube-app-demo](./imgs/react-youtube-app-demo.gif)

## 2. Tech Stack

- **React**: Bootstrapped with [`create-react-app` and `yarn`](https://github.com/facebook/create-react-app?tab=readme-ov-file#yarn). Utilizes React Context API with a custom `useYoutubeApiContext` hook for shared state management.
- **React Router**: Implements [SPA-style routing using `react-router-dom`](./src/index.js), featuring a [persistent search bar](./src/components/SearchHeader.jsx).

  - `/` and `/videos`: Render `Videos` component with a list of trending videos.
  - `/videos/:keyword`: Renders `Videos` component showing videos matching the search query.
  - `/videos/watch/:videoId`: Renders `VideoDetail` component with embedded video playback and related videos.

- **React Query ([@tanstack/react-query](https://tanstack.com/query/latest/docs/framework/react/installation#npm))**: Handles asynchronous API requests, caching, and synchronization with the server state.
- [**Axios**](https://classic.yarnpkg.com/en/package/axios): API request abstraction layer.
- [**Tailwind CSS**](https://classic.yarnpkg.com/en/package/tailwindcss): Utility-first CSS framework used directly within JSX for responsive design.
- [**timeago.js**](https://www.npmjs.com/package/timeago.js/v/4.0.0-beta.3#case): Converts ISO date strings into relative time format (e.g., "2 days ago").
- [**React Icons**](https://react-icons.github.io/react-icons/icons/bs/): Provides scalable vector icons, including the YouTube logo.

## 3. Project Structure

```plaintext
src/
├── api/                    # Real and mock API clients
│   ├── fakeYoutubeClient.js
│   ├── youtube.js
│   └── youtubeClient.js
├── components/             # UI components
│   ├── ChannelInfo.jsx
│   ├── RelatedVideos.jsx
│   ├── ScrollToTop.jsx
│   ├── SearchHeader.jsx
│   └── VideoItem.jsx
├── context/                # Global state context
│   └── YoutubeApiContext.jsx
├── pages/                  # Container components
│   ├── NotFound.jsx
│   ├── VideoDetail.jsx
│   └── Videos.jsx
├── App.js
├── index.css
└── index.js
```

- `/src/pages`: Contains container components such as `Videos` and `VideoDetail`, each serving as high-level UI sections composed of child components.
- `/src/components`: Includes modular UI components such as `VideoItem`, `ChannelInfo`, and `SearchHeader`. These are designed for reusability and separation of concerns. For example:
  - `VideoItem` dynamically adjusts its layout based on the parent (`Videos` vs. `RelatedVideos`).
  - `ChannelInfo` and `SearchHeader` manage their own API requests to ensure localized error handling.
- `/src/context`: Contains the Context and associated custom hook for managing YouTube client instances without prop drilling.
- `/src/api`: Implements dependency injection for API calls. A `Youtube` class takes an `apiClient` instance, allowing flexible switching between real and mock data sources (`YoutubeClient` vs. `FakeYoutubeClient`).

## 4. Key Features

### 4.1 API integration & management

- **Trending Videos on Landing Page**: The landing page displays the most trending videos for users to quickly access popular content.
- **Related Videos on Video Pages**: Each video page renders related videos for users to discover more content based on their current selection.
- **API Request Abstraction**: API requests are abstracted from UI components using dependency injection for separation of concerns and making the code more maintainable and testable.

```js
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
  ...
}
```

🔼 See more: [./src/api/youtube.js](./src/api/youtube.js)

### 4.2 Technical implementation details

- **Single-Page Application**: Browser history and URL state management enable seamless navigation and bookmarking.
- **Server State Caching**: Cached API responses prevent unnecessary refetches to improve performance and reduce quota usage.

```jsx
export default function Videos() {
  const { keyword } = useParams();
  const { youtube } = useYoutubeApi();
  const {
    isLoading,
    error,
    data: videos,
  } = useQuery({
    queryKey: ['videos', keyword],
    queryFn: () => youtube.search(keyword),
    staleTime: 1000 * 60 * 1,
    refetchOnWindowFocus: false,
  });

  return ...
}
```

🔼 See more: [./src/pages/Videos.jsx](./src/pages/Videos.jsx)

- **Strict Mode Compliance**: Developed under `React.StrictMode` to highlight potential issues and ensure best practices.
- **URL-State Synchronization**: Search keywords update the route via `useParams` for UI and URL consistency.

```jsx
export default function SearchHeader() {
  const [text, setText] = useState('');
  const { keyword } = useParams();
  const navigate = useNavigate();
  const handleChange = (e) => setText(e.target.value);
  const handleSubmit = (e) => {
    e.preventDefault();
    setText('');
    navigate(`/videos/${text}`);
  };

  useEffect(() => setText(keyword ? keyword : ''), [keyword]);

  return ...
}
```

🔼 See more: [./src/components/SearchHeader.jsx](./src/components/SearchHeader.jsx)

### 4.3 UX/UI

![react-youtube-responsive-demo](./imgs/react-youtube-responsive-demo.gif)

- **Fully Responsive UI**: Layout dynamically adjusts for various screen sizes.
- **Persistent Search Bar**: Always-visible search bar allows for seamless keyword-based search across the entire app.
- **Scroll-to-Top on Navigation**: Improves UX by mimicking native page transitions in an SPA.

## 5. Implementation Notes & Technical Challenges

### 5.1 API quota limitation

Due to the [daily quota limit on the YouTube API](https://developers.google.com/youtube/v3/guides/quota_and_compliance_audits#:~:text=Projects%20that%20enable%20the%20YouTube,in%20the%20Google%20API%20Console.), local development and testing involves mock JSON data. The API layer is abstracted through dependency injection for effortless switching between data modes. The `Youtube` class accepts either:

- `YoutubeClient`: Fetches real data from YouTube.
- `FakeYoutubeClient`: Returns static mock data for development/testing purposes.

### 5.2 Related videos retrieval

Initially, the plan was to fetch related videos using `relatedToVideoId`, but [this parameter is deprecated](https://developers.google.com/youtube/v3/revision_history#june-12,-2023). Instead:

1. The app retrieves the `channelId` from the selected video.
2. Then it fetches the latest uploads from the same channel using the `/search` endpoint.
   This approach provides contextually relevant results while minimizing code refactoring.

Additionally, handling of `/search` and `/videos` responses required careful parsing due to differing response formats.

## 6. Running the App

1. **Clone the repository:**

   ```bash
   git clone <THIS_PROJECT>
   ```

2. **Install dependencies:**

   ```bash
   yarn install
   ```

3. **Select a data mode:**

   **▶️ Option 1: Use real YouTube data**

   - Obtain an [API key from Google](https://support.google.com/googleapi/answer/6158862?hl=en).
   - Create a `.env` file in the root directory:
     ```
     REACT_APP_YOUTUBE_API_KEY=<YOUR_API_KEY>
     ```
   - Ensure `.env` is listed in `.gitignore`.
   - In `/src/context/YouTubeApiContext.jsx`:
     - Comment out:
       ```js
       const client = new FakeYoutubeClient();
       ```
     - Uncomment:
       ```js
       const client = new YoutubeClient();
       ```

   **▶️ Option 2: Use mock data**

   - In `/src/context/YouTubeApiContext.jsx`:
     - Comment out:
       ```js
       const client = new YoutubeClient();
       ```
     - Uncomment:
       ```js
       const client = new FakeYoutubeClient();
       ```

4. **Start the development server:**
   ```bash
   yarn start
   ```

## 7. Known Warnings

- **ESLint Warning**: Unused `YoutubeClient` or `FakeYoutubeClient` import. This is intentional to facilitate quick switching between data modes and can be safely ignored.
- **Source Map Warning**: May occur due to `timeago.js`. This has no functional impact. To suppress:
  ```ini
  GENERATE_SOURCEMAP=false
  ```

## 8. Contribution

If you find a bug or have a suggestion for improvement, feel free to open an issue or submit a pull request.

---

⚙️ Built with love for clean UIs and scalable architecture - by Cathy Jung.

<div style="position: relative;">
  <a href="https://www.linkedin.com/in/cathy-ock-kyung-jung-18a66296/" style="position: absolute; right: 10px;" target="_blank" rel="noopener noreferrer">
    <img src="./imgs/logo-linkedin.webp" style="width: 28px;"/>
  </a>
</div>
