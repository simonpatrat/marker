import React from 'react';
import { Link } from 'react-router-dom';
import { Icon, Table, Button, Image } from 'semantic-ui-react';
import { getDateString } from './helpers';
import { ConfirmationModal } from '../ConfirmationModal';

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
  informations,
  type,
  dateBookmarked,
  onClickDeletButton,
}) => {
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
      <Table.Cell>{getDateString(informations.dateAdded)}</Table.Cell>
      <Table.Cell>{getDateString(dateBookmarked)}</Table.Cell>
      <Table.Cell className="actions-table-cell">
        <Link to={`/bookmark/${bookmarkId}`} className="ui button primary mini">
          Update
        </Link>
        <ConfirmationModal
          modalTriggerElement={
            <Button size="mini" type="button">
              Delete
            </Button>
          }
          confirmCallback={(): Promise<void> => onClickDeletButton(bookmarkId)}
        />
      </Table.Cell>
    </Table.Row>
  );
};
