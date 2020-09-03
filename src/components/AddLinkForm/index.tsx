import React, { useCallback, useRef, useState, useContext } from 'react';
import { Form, Button, Ref, Input } from 'semantic-ui-react';
import { VideoBookmarkLink, ImageBookmarkLink, Bookmark } from '../../lib/types';
import { isValidUrl, isVimeoUrl, isFlickrUrl } from '../../lib/helpers/url';
import { getVideoInfos } from '../../lib/externalApis/vimeo';
import { getPhotoInfos } from '../../lib/externalApis/flickr';
import { BookmarksContext } from '../../context';

import { FeedBackMessage } from '../FeedbackMessage';

import { addBookmarkForm as labels } from '../../lib/labels';

type AddLinkFormProps = {};

export const AddLinkForm: React.FunctionComponent<AddLinkFormProps> = ({}) => {
  const formElement = useRef<HTMLFormElement | null>(null);

  // TODO: useReducer instead of multiple useStates
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
        setCurrentLinkIsValid(false);
        setLoading(false);
        setErrorMessages([...errorMessages, labels.errorMessage.urlNotValid]);
        return;
      }

      const mediaType = isVimeoUrl(url) ? 'video' : 'image';

      setLinkMediaType(mediaType);

      if (isFlickrUrl(url)) {
        // TODO: move apis fetching to backend to prevent api keys licks

        try {
          const photoInfos = await getPhotoInfos(url);
          if (!photoInfos) {
            throw new Error();
          }
          setCurrentLinkIsValid(true);
          setErrorMessages(
            errorMessages.filter((message) => message !== labels.errorMessage.urlNotValid),
          );

          setCurrentLinkInformation(photoInfos);
        } catch (error) {
          setCurrentLinkIsValid(false);
          return;
        }
      }

      if (isVimeoUrl(url)) {
        try {
          const videoInfos = await getVideoInfos(url);
          if (!videoInfos) {
            throw new Error();
          }
          setCurrentLinkIsValid(true);
          setErrorMessages(
            errorMessages.filter((message) => message !== labels.errorMessage.urlNotValid),
          );

          setCurrentLinkInformation(videoInfos);
        } catch (error) {
          setCurrentLinkIsValid(false);
          return;
        }
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

      // TODO: move apis fetching to backend to prevent api keys licks

      try {
        const response = await fetch('/api/v1/bookmarks', {
          method: 'POST',
          body: JSON.stringify(values),
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const responseData = await response.json();

        if (responseData.error) {
          throw new Error(responseData.message);
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
      } catch (error) {
        setErrorMessages([...new Set([...errorMessages, error.message || error])]);
        if (formElement && formElement.current) {
          formElement.current.reset();
        }
        return;
      }
    },
    [linkMediaType, currentLinkInformation, currentLinkIsValid, errorMessages, dispatch],
  );

  const couldSubmit = linkMediaType && currentLinkInformation && currentLinkIsValid;
  return (
    <Ref innerRef={formElement}>
      <Form onSubmit={handleFormSubmit}>
        {errorMessages && errorMessages.length > 0
          ? errorMessages.map((message: string, index) => {
              return (
                <FeedBackMessage
                  key={`error-message#${message}#${index.toString(36)}`}
                  message={message}
                  type="negative"
                >
                  {message}
                </FeedBackMessage>
              );
            })
          : null}

        <Form.Field>
          <Input
            type="url"
            name="url"
            label="Url"
            id="link-url-input"
            onChange={handleUrlInputChange}
            placeholder="https://vimeo.com/451005534"
            loading={loading}
          />
        </Form.Field>

        <Button type="submit" primary disabled={!couldSubmit}>
          Enregister le lien
        </Button>
      </Form>
    </Ref>
  );
};
