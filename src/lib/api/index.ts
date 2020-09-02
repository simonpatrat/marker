import { BookmarksResponse, Bookmark } from '../../lib/types';

type GetBookMarksApiCallParameters = {
  perPage?: number;
  page?: number;
};

export const getBookmarks = async ({
  perPage,
  page,
}: GetBookMarksApiCallParameters): Promise<BookmarksResponse> => {
  const perPageParam = perPage ? `?perPage=${perPage}` : '';
  const pageParam = page ? `&page=${page}` : '';
  const response = await fetch(`/api/v1/bookmarks${perPageParam}${pageParam}`);
  const json = await response.json();
  return json;
};

export const deleteBookmark = async (
  id: number | string | undefined,
): Promise<BookmarksResponse> => {
  const response = await fetch('/api/v1/bookmarks', {
    method: 'DELETE',
    body: JSON.stringify({ id }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await response.json();

  return data;
};

export const updateBookmark = async (bookmark: Bookmark): Promise<BookmarksResponse> => {
  const response = await fetch('/api/v1/bookmarks', {
    method: 'PUT',
    body: JSON.stringify(bookmark),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await response.json();

  return data;
};
