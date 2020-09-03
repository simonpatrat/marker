/* eslint-disable react/no-unescaped-entities*/
import React, { useCallback, useContext, useEffect, ReactText } from 'react';
import { Link } from 'react-router-dom';
import { Icon, Table, Button, Image } from 'semantic-ui-react';

import { BookmarksContext } from '../../context';

import { getDateString } from './helpers';

import { getBookmarks, deleteBookmark } from '../../lib/api';

import { Bookmark } from '../../lib/types';

import { Pagination } from '../Pagination';
import { ConfirmationModal } from '../ConfirmationModal';

import { BookmarkListItem } from './BookmarkListItem';

type BookmarkListProps = {};

export const BookmarkList: React.FunctionComponent<BookmarkListProps> = () => {
  const { state, dispatch } = useContext(BookmarksContext);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      const data = await getBookmarks({ perPage: 5, page: 1 });

      if (data.error) {
        // TODO: Provide indication on error
        // flashErrorMessage(dispatch, error);
        return;
      }

      const { bookmarks, pagination } = data;
      if (bookmarks && pagination) {
        dispatch({
          type: 'FETCH_BOOKMARKS',
          payload: {
            bookmarks,
            pagination,
          },
        });
      }
    };
    fetchData();
  }, [dispatch]);

  const handlePaginationButtonClick = useCallback(
    async (requestedPage: number) => {
      try {
        const data = await getBookmarks({ perPage: 5, page: requestedPage });
        if (data.error) {
          throw new Error(data.message);
        }

        const { bookmarks, pagination } = data;
        if (bookmarks && pagination) {
          dispatch({
            type: 'CHANGE_PAGINATION',
            payload: {
              bookmarks,
              pagination,
            },
          });
        }
      } catch (error) {
        // TODO: Provide indication on error
        // flashErrorMessage(dispatch, error);
      }
    },
    [dispatch],
  );

  const handleDeleteButtonClick = useCallback(
    async (id) => {
      const data = await deleteBookmark(id);

      if (data.error) {
        // TODO: Provide indication on error
        // flashErrorMessage(dispatch, error);
        return;
      }

      const { bookmarks, pagination } = data;
      if (bookmarks && pagination) {
        dispatch({
          type: 'DELETE_BOOKMARK',
          payload: {
            bookmarks,
            pagination,
          },
        });
      }
    },
    [dispatch],
  );

  const { bookmarks, pagination } = state;

  const shouldDisplayBookmarks = bookmarks && bookmarks.length > 0;
  const shouldDisplayPagination = pagination && pagination.currentPage > 0;

  return shouldDisplayBookmarks ? (
    <Table padded>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Url</Table.HeaderCell>
          <Table.HeaderCell>Titre</Table.HeaderCell>
          <Table.HeaderCell>Auteur</Table.HeaderCell>
          <Table.HeaderCell>Type</Table.HeaderCell>
          <Table.HeaderCell>Date d'ajout</Table.HeaderCell>
          <Table.HeaderCell>Date d'enregistremenet</Table.HeaderCell>
          <Table.HeaderCell>Actions</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {bookmarks.map((bookmark: Bookmark) => {
          const { id, type, dateBookmarked, informations } = bookmark;
          return (
            <BookmarkListItem
              key={id}
              bookmarkId={id}
              type={type}
              dateBookmarked={dateBookmarked}
              informations={informations}
              onClickDeletButton={handleDeleteButtonClick}
            />
          );
        })}
      </Table.Body>

      {shouldDisplayPagination ? (
        <Table.Footer>
          <Table.Row>
            <Table.HeaderCell colSpan="7">
              <Pagination
                pages={pagination.pages}
                currentPage={pagination.currentPage}
                onPageButtonClick={handlePaginationButtonClick}
              />
            </Table.HeaderCell>
          </Table.Row>
        </Table.Footer>
      ) : null}
    </Table>
  ) : (
    <>
      <p>Pas encore de bookmarks pour le moment...</p>
      <p>Commencez par entrer un lien Vimeo ou Flickr dans le champ au dessus.</p>
    </>
  );
};
