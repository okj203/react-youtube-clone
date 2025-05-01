import React from 'react';
import { useYoutubeApi } from '../context/YoutubeApiContext';
import { useQuery } from '@tanstack/react-query';
import VideoItem from './VideoItem';

export default function RelatedVideos({ channelId }) {
  const { youtube } = useYoutubeApi();
  const {
    isLoading,
    error,
    data: relatedVids,
  } = useQuery({
    queryKey: ['related', channelId],
    queryFn: () => youtube.related(channelId),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
  return (
    <>
      {isLoading && <p>Loading</p>}
      {error && <p>No related videos found ⚠️</p>}
      <ul>
        {relatedVids?.map((video) => (
          <VideoItem key={video.id} video={video} type="list" />
        ))}
      </ul>
    </>
  );
}
