import React, { KeyboardEvent, useCallback, useEffect, useRef } from 'react';
import { css } from '@emotion/react';
import { useDispatch } from 'react-redux';
import { DragHandle } from '@components/editor/DragHandle';
import { NodeData } from '@/typings/editor.type';
import { addBottomNode } from '@/features/editorSlice';
import { TextBlock } from '@components/editor/TextBlock';

type EditorNodeProps = NodeData & {
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
    if (e.key === 'Enter') {
      e.preventDefault();
      dispatch(addBottomNode(props.id));
    }
  }, []);

  return (
    <div data-node-id={props.id} css={nodeContainerCss}>
      <TextBlock ref={nodeRef}
                 nodeId={props.id}
                 isLastBlock={props.isLastNode}
                 kbdListener={kbdListener}/>
      <DragHandle onPlusClick={() => dispatch(addBottomNode(props.id))}/>
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
