import React, { useCallback, useRef, useState, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Form, Button, Image } from 'semantic-ui-react';

import { updateBookmark } from '../../lib/api';

import { BookmarksContext } from '../../context';

import { Bookmark } from '../../lib/types';

import { BookmarkKeywordsList } from '../BookmarkKeywordsList';
import { FeedBackMessage } from '../FeedbackMessage';

import { getVideoDurationTime } from '../BookmarkList/helpers';

type UpdateLinkFormProps = {
  bookmarkToUdpate: Bookmark;
};

export const UpdateLinkForm: React.FunctionComponent<UpdateLinkFormProps> = ({
  bookmarkToUdpate,
}) => {
  const { id } = useParams();
  const history = useHistory();
  const [bookmark, setBookmark] = useState<Bookmark | null>(bookmarkToUdpate);
  const [newKeyword, setNewKeyword] = useState<string | null>(null);
  const [errorMessages, setErrorsMessages] = useState<string[]>([]);
  const { state, dispatch } = useContext(BookmarksContext);

  const formElement = useRef(null);
  const keywordInputElement = useRef<HTMLInputElement | null>(null);

  const handleFormSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
      event.preventDefault();
      const dateBookmarked = new Date().toISOString();
      if (bookmark) {
        try {
          const data = await updateBookmark({
            ...bookmark,
            dateBookmarked,
          });
          if (data.error) {
            throw new Error(data.message);
          }

          const { bookmarks, pagination } = data;
          if (bookmarks && pagination) {
            dispatch({
              type: 'UPDATE_BOOKMARK',
              payload: {
                bookmarks,
                pagination,
              },
            });

            history.push('/');
          }
        } catch (error) {
          setErrorsMessages([...new Set([...errorMessages, error])]);
        }
      }
    },
    [bookmark, errorMessages],
  );

  const handleDeleteKeyWordButtonClick = useCallback(
    (keyword: string) => {
      if (bookmark) {
        setBookmark({
          ...bookmark,
          keywords: bookmark.keywords.filter((kw) => {
            return kw !== keyword;
          }),
        });
      }
    },
    [bookmark],
  );

  const handleAddkeyWordButtonClick = useCallback(() => {
    if (newKeyword && bookmark) {
      setBookmark({
        ...bookmark,
        keywords: Array.from(new Set([...bookmark.keywords, newKeyword])),
      });
      if (keywordInputElement && keywordInputElement.current) {
        keywordInputElement.current.value = '';
      }
    }
  }, [newKeyword, bookmark]);

  const handleKeyWordInputChange = useCallback(
    (event: React.FormEvent<HTMLInputElement>) => {
      const { currentTarget } = event;
      const { value } = currentTarget;
      const keyword = value.trim();
      if (keyword.length > 3) {
        setNewKeyword(keyword);
      }
    },
    [setNewKeyword],
  );

  const duration =
    bookmark && 'duration' in bookmark.informations
      ? getVideoDurationTime(bookmark.informations.duration)
      : null;
  const couldSubmit = true; // TODO: FIXME: validation + condition

  return bookmark ? (
    <>
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

      <div className="bookmark bookmark--in-modify-page">
        {bookmark.informations?.photoUrl && (
          <div>
            <Image
              src={bookmark.informations.photoUrl}
              as="a"
              size="medium"
              href={bookmark.informations.url}
              target="_blank"
            />
          </div>
        )}
        <div>
          <div>Titre: {bookmark.informations.title}</div>
          <div>Type: {bookmark.type}</div>
          <div>Url: {bookmark.informations.url}</div>
          <div>Auteur: {bookmark.informations.author}</div>
          <div>Largeur: {bookmark.informations.width}px</div>
          <div>Hauteur: {bookmark.informations.height}px</div>
          {duration && <div>Durée: {duration}</div>}
          <div>Mots clés: </div>
          <BookmarkKeywordsList
            onClickDeleteButton={handleDeleteKeyWordButtonClick}
            bookmark={bookmark}
            withDeleteButton
          />
        </div>
      </div>
      <Form ref={formElement} onSubmit={handleFormSubmit}>
        <Form.Field>
          <label htmlFor="tags-input">
            Ajouter un mot clé (3 caractères minimum)
            <input
              ref={keywordInputElement}
              type="text"
              name="tag"
              id="tags-input"
              onChange={handleKeyWordInputChange}
              placeholder="Votre mot clé"
            />
          </label>
          <Button type="button" onClick={handleAddkeyWordButtonClick}>
            Ajouter
          </Button>
        </Form.Field>

        <Button type="submit" disabled={!couldSubmit} primary>
          Sauvegarder!
        </Button>
      </Form>
    </>
  ) : null;
};
