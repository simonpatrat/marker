import React from 'react';
import { Label, Icon } from 'semantic-ui-react';
import { Bookmark } from '../../lib/types';

export const BookmarkKeywordsList: React.FunctionComponent<{
  bookmark: Bookmark;
  onClickDeleteButton?: (keyword: string) => void;
  withDeleteButton?: boolean;
}> = ({ bookmark, onClickDeleteButton, withDeleteButton }) => {
  return bookmark.keywords && bookmark.keywords.length > 0 ? (
    <ul className="keywords-list">
      {[...bookmark.keywords].map((keyword, index) => {
        return (
          <li key={`keyword-list__item#${keyword}#${index.toString(36)}`}>
            <Label image>
              {keyword}
              {withDeleteButton && onClickDeleteButton && (
                <Icon name="delete" onClick={(): void => onClickDeleteButton(keyword)} />
              )}
            </Label>
          </li>
        );
      })}
    </ul>
  ) : (
    <p>Aucun mot clé pour le moment</p>
  );
};
