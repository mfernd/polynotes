import { FiChevronRight } from 'react-icons/all';
import { Badge } from '@geist-ui/core';
import { css } from '@emotion/react';

type ItemProps = {
  isCollapsible?: boolean;
  icon?: JSX.Element;
  title: string;
  isNew?: boolean;
};

export const Item = (props: ItemProps) => {
  return (
    <div css={itemCss}>
      {props.isCollapsible
        ? <button css={collapsibleCss}><FiChevronRight/></button>
        : null}
      <span css={center}>{props.icon}</span>
      <span css={css`
        ${center};
        flex-grow: 1;`}>{props.title}</span>
      {props.isNew ? <Badge css={newBadgeCss} style={{ backgroundColor: '#fe0096' }} scale={2/3}>new</Badge> : null}
    </div>
  );
};

const center = css`display: flex;`;

const itemCss = css`
  position: relative;
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

const newBadgeCss = css`
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
`;
