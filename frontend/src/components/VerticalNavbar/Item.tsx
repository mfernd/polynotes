import { FiChevronRight } from 'react-icons/all';
import { css } from '@emotion/react';

type ItemProps = {
  isCollapsible?: boolean;
  icon?: JSX.Element;
  title: string;
};

export const Item = (props: ItemProps) => {
  return (
    <div css={itemCss}>
      {props.isCollapsible
        ? <button css={collapsibleCss}><FiChevronRight/></button>
        : null}
      <span css={center}>{props.icon}</span>
      <span css={css`${center};
        flex-grow: 1`}>{props.title}</span>
    </div>
  );
};

const center = css`display: flex;`;

const itemCss = css`
  cursor: pointer;
  min-height: 27px;
  padding: 3px 10px 3px 10px;
  border-radius: 3px;
  display: flex;
  align-items: center;
  gap: 5px;

  &:hover {
    background-color: rgba(55, 53, 47, 0.08);
  }

  &:active, &:focus {
    background-color: rgba(55, 53, 47, 0.16);
  }
`;

const collapsibleCss = css`
  ${center};
  cursor: pointer;
  background-color: transparent;
  padding: 0;
  border: none;
`;