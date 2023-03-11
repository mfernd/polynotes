import { RxDragHandleDots2, RxPlus } from 'react-icons/all';
import { css } from '@emotion/react';
import { IconContext } from 'react-icons';
import { addBottomNode } from '@/features/editorSlice';
import { useDispatch } from 'react-redux';

type DragHandleProps = {
  nodeId: string;
  show: boolean;
};

export const DragHandle = (props: DragHandleProps) => {
  const dispatch = useDispatch();

  return (
    <div className={'drag-handle'} css={css`
      ${dragHandleCss};
      ${props.show ? showDragHandle : undefined};
    `}>
      <div css={squareIcon} onClick={() => dispatch(addBottomNode(props.nodeId))}>
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
  left: -4px;
  top: 2px;
  transform: translateX(-100%);
  display: flex;
  opacity: 0;

  // on hover
  &:hover {
    transition: opacity 200ms ease-in;
    opacity: 1;
  }
`;

const showDragHandle = css`
  transition: opacity 200ms ease-in;
  opacity: 1;
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
