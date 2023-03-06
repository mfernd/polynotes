import { RxDragHandleDots2, RxPlus } from 'react-icons/all';
import { css } from '@emotion/react';
import { IconContext } from 'react-icons';

export const DragHandle = () => {
  return (
    <div className={'drag-handle'} css={dragHandleCss}>
      <div css={squareIcon}>
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
  top: 1px;
  transform: translateX(-100%);

  display: flex;
  visibility: hidden;
  opacity: 0;
`;

const buttonCss = css`
  cursor: grab;
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
  width: 28px;
  height: 28px;

  .plus {
    width: 20px;
    height: 100%;
  }
`;

const dragIcon = css`
  ${buttonCss};
  width: 22px;
  height: 28px;

  .handle {
    width: 18px;
    height: 18px;
  }
`;
