import React, { useCallback, useRef, useState, useContext } from 'react';
import { Form, Button, Ref, Loader } from 'semantic-ui-react';
import { VideoBookmarkLink, ImageBookmarkLink, Bookmark } from '../../lib/types';
import { isValidUrl, isVimeoUrl, isFlickrUrl } from '../../lib/helpers/url';
import { getVideoInfos } from '../../lib/externalApis/vimeo';
import { getPhotoInfos } from '../../lib/externalApis/flickr';
import { BookmarksContext } from '../../context';

type AddLinkFormProps = {};

export const AddLinkForm: React.FunctionComponent<AddLinkFormProps> = ({}) => {
  const formElement = useRef<HTMLFormElement | null>(null);

  const [linkMediaType, setLinkMediaType] = useState<'video' | 'image' | null>(null);
  const [currentLinkInformation, setCurrentLinkInformation] = useState<
    VideoBookmarkLink | ImageBookmarkLink | null
  >(null);
  const [currentLinkIsValid, setCurrentLinkIsValid] = useState<boolean>(false);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const { state: contextStoreState, dispatch } = useContext(BookmarksContext);

  const handleUrlInputChange = useCallback(
    async (event: React.FormEvent<HTMLInputElement>): Promise<void> => {
      setLoading(true);

      const { value: url } = event.currentTarget;
      if (!isValidUrl(url)) {
        // TODO: useReducer and form validation
        // TODO: handle errors correctly and display messages
        // TODO: React react-hook-form
        // alert('Invalid URL, please enter Vimeo or Flickr URLs.');
        console.log('NON VALIDE');
        setCurrentLinkIsValid(false);
        setLoading(false);
        return;
      }

      const mediaType = isVimeoUrl(url) ? 'video' : 'image';
      console.log('VALIDE', mediaType);

      setLinkMediaType(mediaType);

      if (isFlickrUrl(url)) {
        // TODO: try catch
        // TODO: move apis fetching to backend to prevent api keys licks
        const photoInfos = await getPhotoInfos(url);
        if (!photoInfos) {
          setCurrentLinkIsValid(false);
          return;
        }
        setCurrentLinkIsValid(true);
        console.log(photoInfos);
        setCurrentLinkInformation(photoInfos);
      }

      if (isVimeoUrl(url)) {
        // TODO: try catch
        const videoInfos = await getVideoInfos(url);
        if (!videoInfos) {
          setCurrentLinkIsValid(false);
          return;
        }
        setCurrentLinkIsValid(true);
        console.log('VIDEO info: ', videoInfos);
        setCurrentLinkInformation(videoInfos);
      }

      setLoading(false);
    },
    [setLoading],
  );

  const handleFormSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!currentLinkIsValid || !linkMediaType || !currentLinkInformation) {
        return;
      }
      const values: Bookmark = {
        type: linkMediaType,
        informations: currentLinkInformation,
        dateBookmarked: new Date().toISOString(),
        keywords: [],
      };
      // TODO: try catch
      // TODO: move apis fetching to backend to prevent api keys licks

      const response = await fetch('/api/v1/bookmarks', {
        method: 'POST',
        body: JSON.stringify(values),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const responseData = await response.json();

      if (responseData.error) {
        setErrorMessages([...errorMessages, responseData.message]);
        if (formElement && formElement.current) {
          formElement.current.reset();
        }
        return;
      }

      await setCurrentLinkInformation(null);
      await setLinkMediaType(null);
      await setCurrentLinkIsValid(false);

      dispatch({
        type: 'ADD_BOOKMARK',
        payload: responseData,
      });

      if (formElement && formElement.current) {
        formElement.current.reset();
        setErrorMessages([]);
      }
    },
    [linkMediaType, currentLinkInformation, currentLinkIsValid, errorMessages, dispatch],
  );

  /*
  0) detect if it is valid url ✅
  1) detect vimeo or flickr ✅
  2) Extract title information ✅
  3) Extract size information ✅
  3.1) Bonus: extract image or poster image

  4) Continue
  */

  const couldSubmit = linkMediaType && currentLinkInformation && currentLinkIsValid;
  return (
    <Ref innerRef={formElement}>
      <Form onSubmit={handleFormSubmit}>
        {errorMessages && errorMessages.length > 0
          ? errorMessages.map((message: string, index) => {
              return (
                <p style={{ color: 'red' }} key={`error-message#${message}#${index.toString(36)}`}>
                  {message}
                </p>
              );
            })
          : null}
        <br />
        <Form.Group inline>
          <Form.Field>
            <label htmlFor="link-url-input">
              Url
              <input
                type="url"
                name="url"
                id="link-url-input"
                onChange={handleUrlInputChange}
                placeholder="Entrer une url Vimeo ou Flikr"
              />
            </label>
            {loading && <Loader active inline size="small" />}
          </Form.Field>
        </Form.Group>
        <Button type="submit" primary disabled={!couldSubmit}>
          Sauvegarder!
        </Button>
      </Form>
    </Ref>
  );
};
