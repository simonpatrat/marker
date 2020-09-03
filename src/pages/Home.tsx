import React from 'react';

import { AddLinkForm } from '../components/AddLinkForm';
import { BookmarkList } from '../components/BookmarkList';

type HomeProps = {};

export const Home: React.FunctionComponent<HomeProps> = () => {
  return (
    <section className="home page">
      <header className="page__header">
        <h1>Liste des bookmarks</h1>
        <p>Commencez par entrer un lien Vimeo ou Flickr</p>
      </header>
      <AddLinkForm />
      <BookmarkList />
    </section>
  );
};
