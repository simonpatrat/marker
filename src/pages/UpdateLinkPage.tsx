import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Bookmark } from '../lib/types';

import { getBookmark as apiGetBookmark } from '../lib/api';

import { UpdateLinkForm } from '../components/UpdateLinkForm';

type HomeProps = {};

export const UpdateLinkPage: React.FunctionComponent<HomeProps> = () => {
  const { id } = useParams();
  const [bookmark, setBookmark] = useState<Bookmark | null>(null);

  useEffect(() => {
    const getBookmark = async (): Promise<void> => {
      const responseJson = await apiGetBookmark(id);
      if (!responseJson.error && responseJson.bookmark) {
        setBookmark(responseJson.bookmark);
      }
    };

    getBookmark();
  }, [id, setBookmark]);

  return (
    <section className="page update-link-page">
      <header className="page__header">
        <h1>Modifier le lien {bookmark && `"${bookmark.informations.title}"`}</h1>
      </header>
      {bookmark && <UpdateLinkForm bookmarkToUdpate={bookmark} />}
    </section>
  );
};
