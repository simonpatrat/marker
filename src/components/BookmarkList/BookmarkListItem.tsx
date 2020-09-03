import React from 'react';
import { Link } from 'react-router-dom';
import { Icon, Table, Button, Image } from 'semantic-ui-react';
import { getDateString } from './helpers';
import { ConfirmationModal } from '../ConfirmationModal';

import { getVideoDurationTime } from './helpers';

import { Bookmark } from '../../lib/types';

type BookmarkListItemProps = {
  bookmarkId: string | number | undefined;
  informations: Bookmark['informations'];
  type: string;
  dateBookmarked: string;
  onClickDeletButton: (id: string | number | undefined) => Promise<void>;
};

export const BookmarkListItem: React.FunctionComponent<BookmarkListItemProps> = ({
  bookmarkId,
  informations = { duration: 0 },
  type,
  dateBookmarked,
  onClickDeletButton,
}) => {
  const duration = 'duration' in informations ? getVideoDurationTime(informations.duration) : '-';
  console.log('informations: ', informations);

  return (
    <Table.Row>
      <Table.Cell className="bookmark-url-cell">
        {informations.photoUrl && (
          <Image src={informations.photoUrl} size="tiny" verticalAlign="middle" />
        )}
        <a href={informations.url} target="_blank" rel="noopener noreferrer">
          {`${informations.url} `}
          <Icon aria-hidden="true" name="external alternate" />
        </a>
      </Table.Cell>
      <Table.Cell>{informations.title}</Table.Cell>
      <Table.Cell>{informations.author}</Table.Cell>
      <Table.Cell>{type}</Table.Cell>
      <Table.Cell>
        <p>Largeur: {informations.width}</p>
        <p>Heuteur: {informations.height}</p>
      </Table.Cell>
      <Table.Cell>
        <p>{duration}</p>
      </Table.Cell>
      <Table.Cell>{informations.dateAdded ? getDateString(informations.dateAdded) : ''}</Table.Cell>
      <Table.Cell>{getDateString(dateBookmarked)}</Table.Cell>
      <Table.Cell className="actions-table-cell">
        <Link to={`/bookmark/${bookmarkId}`} className="ui button primary mini">
          Modifier
        </Link>
        <ConfirmationModal
          modalTriggerElement={
            <Button size="mini" type="button">
              Supprimer
            </Button>
          }
          confirmCallback={(): Promise<void> => onClickDeletButton(bookmarkId)}
        />
      </Table.Cell>
    </Table.Row>
  );
};
