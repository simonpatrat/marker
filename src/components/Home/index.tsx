import React from 'react';

import { AddLinkForm } from '../AddLinkForm';
import { BookmarkList } from '../BookmarkList';

type HomeProps = {};

export const Home: React.FunctionComponent<HomeProps> = () => {
  return (
    <div className="home">
      <h1>Marker</h1>
      <p>A Bookmark saver React application</p>
      <AddLinkForm />
      <BookmarkList />
    </div>
  );
};
