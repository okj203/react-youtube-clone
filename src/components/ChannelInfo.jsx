import React from 'react';
import { useYoutubeApi } from '../context/YoutubeApiContext';
import { useQuery } from '@tanstack/react-query';

export default function ChannelInfo({ channelId, channelTitle }) {
  const { youtube } = useYoutubeApi();
  const { data: url } = useQuery({
    queryKey: ['channel', channelId],
    queryFn: () => youtube.channelImageURL(channelId),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false
  });
  return (
    <div className="flex my-4 mb-8 items-center">
      {url && (
        <img className="w-10 h-10 rounded-full" src={url} alt={channelTitle} />
      )}
      <p className="text-lg font-medium ml-2">{channelTitle}</p>
    </div>
  );
}
