import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Bookmark } from '../lib/types';

import { UpdateLinkForm } from '../components/UpdateLinkForm';

type HomeProps = {};

export const UpdateLinkPage: React.FunctionComponent<HomeProps> = () => {
  const { id } = useParams();
  const [bookmark, setBookmark] = useState<Bookmark | null>(null);

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

  return (
    <section className="page update-link-page">
      <header className="page__header">
        <h1>Modifier le lien {bookmark && `"${bookmark.informations.title}"`}</h1>
      </header>
      {bookmark && <UpdateLinkForm bookmarkToUdpate={bookmark} />}
    </section>
  );
};
