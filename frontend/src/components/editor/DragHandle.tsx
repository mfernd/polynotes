import { FiTrash2, RxDragHandleDots2, RxPlus } from 'react-icons/all';
import { useDispatch } from 'react-redux';
import { css } from '@emotion/react';
import { addBottomNode, deleteNode } from '@/features/editorSlice';

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
        <RxPlus size={'22px'}/>
      </div>
      <div css={trashIcon} onClick={() => dispatch(deleteNode(props.nodeId))}>
        <FiTrash2 size={'18px'}/>
      </div>
      <div css={dragIcon}>
        <RxDragHandleDots2 size={'22px'}/>
      </div>
    </div>
  );
};

const showDragHandle = css`
  transition: opacity 100ms ease-in;
  opacity: 1;
`;

const dragHandleCss = css`
  position: absolute;
  left: -10px;
  top: 50%;
  transform: translateX(-100%) translateY(-50%);
  display: flex;
  opacity: 0;

  // on hover
  &:hover {
    ${showDragHandle};
  }
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
`;

const trashIcon = css`
  ${buttonCss};
  cursor: pointer;
  padding: 0 2px;
`;

const dragIcon = css`
  ${buttonCss};
  cursor: grab;
  width: 22px;
  height: 24px;
`;
