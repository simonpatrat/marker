const URL_REGEXP = /^(?:(?:https?):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
const FLICKR_REGEXP = /(?:https?:\/\/)?(?:www\.)?(flickr\.com\/photos\/(.*?)\/(?<longId>\d*)\/(.*?)\/(.*?)\/?$|flic\.kr\/p\/(?<shortId>.{7})\/?$)/;
const VIMEO_REGEXP = /^(?:https?:\/\/(?:[\w]+\.)*vimeo\.com(?:[/\w:]*(?:\/videos)?)?\/((?<videoId>[0-9]{4,10})\/?))$/;

export const isUrl = (url: string): boolean => {
  return URL_REGEXP.test(url);
};

export const isVimeoUrl = (url: string): boolean => {
  return VIMEO_REGEXP.test(url);
};

export const isFlickrUrl = (url: string): boolean => {
  return FLICKR_REGEXP.test(url);
};

export const isValidUrl = (url: string): boolean => {
  return isUrl(url) && (isFlickrUrl(url) || isVimeoUrl(url));
};

export const getFlikrPhotoId = (flikrPhotoUrl: string): string | null => {
  const matches = flikrPhotoUrl.match(FLICKR_REGEXP);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  if (matches && matches.groups) {
    const { longId, shortId } = matches.groups;

    return longId || shortId;
  }
  return null;
};

export const getVimeoVideoId = (vimeoVideoId: string): string | null => {
  const matches = vimeoVideoId.match(VIMEO_REGEXP);
  if (matches && matches.groups) {
    const { videoId } = matches.groups;
    return videoId;
  }
  return null;
};
