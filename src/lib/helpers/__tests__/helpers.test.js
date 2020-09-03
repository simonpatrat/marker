import { isFlickrUrl, isVimeoUrl, isUrl } from '../url';

const invalidUrls = ['s', 'shdqld//', 'https://', 'http://', 'ftp://', '.http://test'];
const validUrls = [
  'https://google.com',
  'http://test.fr',
  'https://www.example.com/foo/?bar=baz&inga=42&quux',
];

const invalidFlikrUrls = [
  'https://google.com',
  'http://flic.kr/p/2jAEXNH/test12',
  'https://www.flickr.com/photos/',
  'https://www.flickr.com/photos/pageworld/50270116493/in/explore-2020-08-27/sdsadasd',
];
const validFlickrUrls = [
  'https://www.flickr.com/photos/etienner68/50275477217/in/explore-2020-08-27/',
  'https://www.flickr.com/photos/zataom/50274457943/in/explore-2020-08-28',
  'https://www.flickr.com/photos/etienner68/50275477217/sizes/l/',
  'https://flic.kr/p/2jAEXNH',
  'http://www.flickr.com/photos/etienner_68/50275477217/in/explore-2020-08-27/',
  'https://flic.kr/p/2jAzJP2',
  'https://www.flickr.com/photos/ferdinand_hejl/50277385393/in/explore-2020-08-28/',
  'https://www.flickr.com/photos/37034324@N05/50273037568/in/explore-2020-08-27/',
];

const invalidVimeoUrls = [
  'https://vimeo.com',
  'https://vimeo.com/sometext123',
  'https://www.youtube.com/watch?v=aBG0P9P0vxM',
  'https://vimeo.com/22064395912',
  'https://vimeo.com/channels/staffpicks/45155245457',
];

const validVimeoUrls = [
  'https://vimeo.com/220643959',
  'https://vimeo.com/channels/staffpicks/451552454',
  'https://vimeo.com/3251262',
];

describe('function: isUrl', () => {
  it('should return false if given string is not a url', () => {
    invalidUrls.forEach((url) => {
      expect(isUrl(url)).toBe(false);
    });
  });

  it('should return true if given string is an url', () => {
    validUrls.forEach((url) => {
      expect(isUrl(url)).toBe(true);
    });
  });
});

describe('function: isFlickrUrl', () => {
  it('should return false if given string is not a flickr photo url', () => {
    invalidFlikrUrls.forEach((url) => {
      expect(isFlickrUrl(url)).toBe(false);
    });
  });

  it('should return true if given string is a flickr photo url', () => {
    validFlickrUrls.forEach((url) => {
      expect(isFlickrUrl(url)).toBe(true);
    });
  });
});

describe('function: isVimeoUrl', () => {
  it('should return false if given string is not a Vimeo video url', () => {
    invalidVimeoUrls.forEach((url) => {
      expect(isVimeoUrl(url)).toBe(false);
    });
  });

  it('should return true if given string is a Vimeo video url', () => {
    validVimeoUrls.forEach((url) => {
      expect(isVimeoUrl(url)).toBe(true);
    });
  });
});
