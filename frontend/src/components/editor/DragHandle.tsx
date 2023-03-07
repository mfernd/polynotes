import { RxDragHandleDots2, RxPlus } from 'react-icons/all';
import { css } from '@emotion/react';
import { IconContext } from 'react-icons';
import { MouseEvent } from 'react';

type DragHandleProps = {
  onPlusClick?: (event?: MouseEvent<HTMLDivElement>) => void;
};

export const DragHandle = (props: DragHandleProps) => {
  return (
    <div className={'drag-handle'} css={dragHandleCss}>
      <div css={squareIcon} onClick={props.onPlusClick}>
        <IconContext.Provider value={{ className: 'plus' }}>
          <RxPlus/>
        </IconContext.Provider>
      </div>
      <div css={dragIcon}>
        <IconContext.Provider value={{ className: 'handle' }}>
          <RxDragHandleDots2/>
        </IconContext.Provider>
      </div>
    </div>
  );
};

const dragHandleCss = css`
  position: absolute;
  left: 0;
  top: 2px;
  transform: translateX(-100%);

  display: flex;
  visibility: hidden;
  opacity: 0;
`;

const buttonCss = css`
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 3px;
  color: rgba(55, 53, 47, 0.5);

  &:hover {
    transition: background-color 20ms ease-in;
    background-color: rgba(55, 53, 47, 0.08);
  }
`;

const squareIcon = css`
  ${buttonCss};
  cursor: pointer;
  width: 24px;
  height: 24px;

  .plus {
    width: 22px;
    height: 22px;
  }
`;

const dragIcon = css`
  ${buttonCss};
  cursor: grab;
  width: 22px;
  height: 24px;

  .handle {
    width: 22px;
    height: auto;
  }
`;
