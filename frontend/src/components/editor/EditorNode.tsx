import { KeyboardEvent, useCallback, useEffect, useRef } from 'react';
import { css } from '@emotion/react';
import { useDispatch } from 'react-redux';
import { addBottomNode, deleteNode, onArrow, setData } from '@/features/editorSlice';
import { Node } from '@/typings/editor.type';
import { DragHandle } from '@components/editor/DragHandle';
import { TextBlock } from '@components/editor/TextBlock';

type EditorNodeProps = Node & {
  isFocused?: boolean;
  isLastNode?: boolean;
};

export const EditorNode = (props: EditorNodeProps) => {
  const dispatch = useDispatch();

  const nodeRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (props.isFocused)
      nodeRef.current?.focus();
  }, [nodeRef, props.isFocused]);

  const kbdListener = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
    if (e.shiftKey) return;
    const selection = window.getSelection();

    if (e.key === 'Enter') {
      e.preventDefault();
      dispatch(addBottomNode());
    } else if (e.key === 'Backspace' && nodeRef.current?.textContent === '') {
      e.preventDefault();
      dispatch(deleteNode());
    } else if (e.key === 'ArrowUp' && selection?.isCollapsed) {
      e.preventDefault();
      dispatch(onArrow(true));
    } else if (e.key === 'ArrowDown' && selection?.isCollapsed) {
      e.preventDefault();
      dispatch(onArrow(false));
    } else {
      if (!nodeRef.current?.textContent) return;
      dispatch(setData(nodeRef.current.textContent));
    }
  }, []);

  return (
    <div data-node-id={props.id} css={nodeContainerCss}>
      <TextBlock ref={nodeRef}
                 nodeId={props.id}
                 data={props.data}
                 placeholder={props.isLastNode ? 'Appuyez sur / pour afficher les commandes…' : undefined}
                 kbdListener={kbdListener}/>
      <DragHandle onPlusClick={() => dispatch(addBottomNode())}/>
    </div>
  );
};

const nodeContainerCss = css`
  position: relative;

  &:hover .drag-handle, & > div:focus + .drag-handle {
    transition: opacity 200ms ease-in;
    visibility: visible;
    opacity: 1;
  }
`;
