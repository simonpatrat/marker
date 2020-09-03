import { getFlikrPhotoId } from '../helpers/url';
import { ImageBookmarkLink } from '../types';

const API_KEY = process.env.REACT_APP_FLICKR_API_KEY;

export const getPhotoInfos = async (url: string): Promise<ImageBookmarkLink | null> => {
  const flikrApiEndpoint = `https://www.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key=${API_KEY}&format=json&nojsoncallback=1`;

  try {
    const photoId = getFlikrPhotoId(url);
    const response = await fetch(`${flikrApiEndpoint}&photo_id=${photoId}`);
    const json = await response.json();
    const { photo } = json;
    const { owner, dateuploaded, title, farm, server, secret } = photo;
    const sizesResponse = await fetch(
      `https://www.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key=${API_KEY}&format=json&nojsoncallback=1&photo_id=${photoId}`,
    );

    const sizesJson = await sizesResponse.json();
    const { sizes } = sizesJson;

    const photoSizes = sizes.size.find((size: { [key: string]: string }) => {
      return (
        size.label === 'Original' ||
        size.label === 'Large 2048' ||
        size.label.toLowerCase().includes('large')
      );
    });
    const { height, width } = photoSizes;

    const photoUrl = `https://farm${farm}.staticflickr.com/${server}/${photoId}_${secret}.jpg`;

    const photoInfo = {
      url,
      title: title._content || 'No title',
      author: owner.realname || owner.username,
      dateAdded: dateuploaded,
      height,
      width,
      photoUrl,
    };

    return photoInfo;
  } catch (error) {
    console.error(error);
    return null;
  }
};
