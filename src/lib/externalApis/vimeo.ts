/* eslint-disable @typescript-eslint/camelcase */
import { getVimeoVideoId } from '../helpers/url';
import { VideoBookmarkLink } from '../types';

export const getVideoInfos = async (url: string): Promise<VideoBookmarkLink | null> => {
  try {
    const vimeoApiEndpoint = `https://api.vimeo.com/videos/`;

    const videoId = getVimeoVideoId(url);
    const response = await fetch(`${vimeoApiEndpoint}${videoId}`, {
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_VIMEO_AUTHORIZATION_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });
    const json = await response.json();
    const { name: title, width, height, user, created_time, duration } = json;
    const videoInfo = {
      url,
      title,
      width,
      height,
      author: user.name,
      dateAdded: created_time,
      duration,
    };

    return videoInfo;
  } catch (error) {
    return null;
  }
};
