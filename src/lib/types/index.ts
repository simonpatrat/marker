export type BookmarkLink = {
  url: string;
  title: string;
  author: string;
  dateAdded: string;
  photoUrl?: string;
};

export type VideoBookmarkLink = BookmarkLink & {
  width: number;
  height: number;
  duration: number; // milliseconds
};

export type ImageBookmarkLink = BookmarkLink & {
  width: number;
  height: number;
};

export type Bookmark = {
  type: string;
  id?: string | number;
  informations: ImageBookmarkLink | VideoBookmarkLink;
  dateBookmarked: string;
  keywords: string[] | [];
};

export type BookmarksResponse = {
  error: boolean;
  pages: number;
  pagination?: {
    currentPage: number;
    perPage: number;
    pages: number;
  };
  bookmarks?: Bookmark[];
  message?: string;
  requestedPage?: number;
};

export type Pagination = {
  currentPage: number;
  pages: number;
  perPage: number;
};

export type Action = {
  type: string;
  payload?: unknown;
};

export type BookmarkAction = Action & {
  payload: {
    bookmarks: Bookmark[];
    pagination?: Pagination;
  };
};
