import React, { useCallback, useRef, useState, useEffect, useContext } from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';
import { Form, Button } from 'semantic-ui-react';

import { updateBookmark } from '../../lib/api';

import { BookmarksContext } from '../../context';

import { Bookmark } from '../../lib/types';

import { BookmarkKeywordsList } from '../BookmarkKeywordsList';

type UpdateLinkFormProps = {};

export const UpdateLinkForm: React.FunctionComponent<UpdateLinkFormProps> = () => {
  const { id } = useParams();
  const history = useHistory();
  const [bookmark, setBookmark] = useState<Bookmark | null>(null);
  const [newKeyword, setNewKeyword] = useState<string | null>(null);
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
            // TODO: Provide indication on error
            // flashErrorMessage(dispatch, error);
            return;
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
          // TODO: Error Message
        }
      }
    },
    [bookmark],
  ); // TODO: handleFormSubmit;

  useEffect(() => {
    const getBookmark = async (): Promise<void> => {
      const response = await fetch(`/api/v1/bookmark/${id}`);
      const responseJson = await response.json();
      if (!responseJson.error) {
        setBookmark(responseJson.bookmark);
      }
    };

    getBookmark();
  }, [id, setBookmark]);

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

      // TODO: Error message if keyword has not enough characters
    },
    [setNewKeyword],
  );

  const couldSubmit = true; // TODO: FIXME: condition

  return bookmark ? (
    <section className="page update-link-page">
      <header className="page__header">
        <h1>Modifier le lien &quot;{bookmark.informations.title}&quot;</h1>
        <Link to="/">Retourner à la liste des bookmarks</Link>
      </header>
      <Form ref={formElement} onSubmit={handleFormSubmit}>
        <div key={id} className="bookmark">
          <div>
            <div>title: {bookmark.informations.title}</div>
            <div>Type: {bookmark.type}</div>
            <div>Url: {bookmark.informations.url}</div>
            <div>Author: {bookmark.informations.author}</div>
            <div>Mots clés: </div>
            <BookmarkKeywordsList
              onClickDeleteButton={handleDeleteKeyWordButtonClick}
              bookmark={bookmark}
              withDeleteButton
            />
          </div>
        </div>
        <Form.Field>
          <label htmlFor="tags-input">
            Ajouter un mot clé
            <input
              ref={keywordInputElement}
              type="text"
              name="tag"
              id="tags-input"
              onChange={handleKeyWordInputChange}
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
    </section>
  ) : null;
};
