import React, { useReducer, createContext } from 'react';

import { BookmarkAction, Bookmark, Pagination } from '../lib/types';

type InitialStateType = {
  bookmarks: Bookmark[];
  loading: boolean;
  pagination: Pagination;
};

const initialState: InitialStateType = {
  bookmarks: [],
  loading: false,
  pagination: {
    pages: 1,
    currentPage: 0,
    perPage: 5,
  },
};

export const BookmarksContext = createContext<{
  state: InitialStateType;
  dispatch: React.Dispatch<BookmarkAction>;
}>({
  state: initialState,
  dispatch: () => null,
});

function reducer(state: InitialStateType, action: BookmarkAction): InitialStateType {
  switch (action.type) {
    case 'FETCH_BOOKMARKS':
    case 'ADD_BOOKMARK':
    case 'UPDATE_BOOKMARK':
    case 'DELETE_BOOKMARK':
    case 'CHANGE_PAGINATION':
      return action.payload && action.payload.bookmarks && action.payload.pagination
        ? {
            ...state,
            bookmarks: action.payload.bookmarks,
            pagination: action.payload.pagination,
          }
        : state;
    default:
      throw new Error('No case for the action: ' + action.type + ' in bookmarks reducer');
  }
}

export const BookmarksContextProvider: React.FunctionComponent<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <BookmarksContext.Provider value={{ state, dispatch }}>{children}</BookmarksContext.Provider>
  );
};
