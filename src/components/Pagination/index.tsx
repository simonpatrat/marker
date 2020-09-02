import React from 'react';
import { Icon } from 'semantic-ui-react';

type PaginationProps = {
  onPageButtonClick: (page: number) => void;
  pages: number;
  currentPage: number;
};

export const Pagination: React.FunctionComponent<PaginationProps> = ({
  pages,
  currentPage,
  onPageButtonClick,
}) => {
  return (
    <div className="pagination-wrapper">
      <ul className="ui pagination right floated menu">
        {pages > 1 && currentPage > 1 ? (
          <li className="pagination__item item previous link">
            <button type="button" onClick={(): void => onPageButtonClick(1)}>
              <span className="sr-only">Revenir à la page précédente</span>
              <Icon name="chevron left" />
            </button>
          </li>
        ) : null}
        {Array(pages)
          .fill({})
          .map((page, index) => {
            const isActive = index + 1 === currentPage;
            return (
              <li
                key={`pagination__item#${index.toString(36)}`}
                className="pagination__item item link"
              >
                <button
                  type="button"
                  disabled={isActive}
                  onClick={
                    isActive
                      ? (): void => {
                          return;
                        }
                      : (): void => onPageButtonClick(index + 1)
                  }
                >
                  <span className="sr-only">Afficher la page </span>
                  {index + 1}
                </button>
              </li>
            );
          })}
        {pages > 1 && currentPage < pages ? (
          <li className="pagination__item item link">
            <button
              type="button"
              onClick={
                pages
                  ? (): void => onPageButtonClick(pages)
                  : (): void => {
                      return;
                    }
              }
            >
              <span className="sr-only">Aller à la page suivante</span>
              <Icon name="chevron right" />
            </button>
          </li>
        ) : null}
      </ul>
    </div>
  );
};
