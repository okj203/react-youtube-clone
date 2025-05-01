import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import VideoItem from '../components/VideoItem';
import { useYoutubeApi } from '../context/YoutubeApiContext';

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

  return (
    <>
      <div>{keyword ? `🔍 Search results for: ${keyword} 🔍` : `🔥 Most popular videos 🔥`}</div>
      <br/>
      {isLoading && <p>Loading</p>}
      {error && <p>Error🚨</p>}
      {
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2 gap-y-4">
          {videos?.map((video) => (
            <VideoItem key={video.id} video={video} />
          ))}
        </ul>
      }
    </>
  );
}
