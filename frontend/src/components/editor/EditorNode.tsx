import { DragHandle } from '@components/editor/DragHandle';
import { css } from '@emotion/react';
import { KeyboardEvent, useCallback, useEffect, useRef } from 'react';
import { Dispatch, RootState } from '@/store';
import { NodeData } from '@/typings/editor.type';
import { connect } from 'react-redux';

const mapState = (state: RootState) => ({
  editorNode: state.editorNode,
});

const mapDispatch = (dispatch: Dispatch) => ({
  addBottomNode: dispatch.editorNode.addBottomNode,
  removeNode: dispatch.editorNode.removeNode,
});

type EditorNodeProps = ReturnType<typeof mapState> &
  ReturnType<typeof mapDispatch> &
  NodeData & {
  isFocused?: boolean;
  placeholder?: string;
};

export const EditorNode = connect(mapState, mapDispatch)((props: EditorNodeProps) => {
  const nodeRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (props.isFocused)
      nodeRef.current?.focus();
  }, [nodeRef]);

  const kbdListener = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      props.addBottomNode(props.id);
    }
  }, []);

  return (
    <div data-node-id={props.id} css={nodeContainerCss}>
      <div ref={nodeRef} contentEditable
           placeholder={props.placeholder}
           onKeyDown={kbdListener}
           css={nodeCss}></div>
      <DragHandle onPlusClick={() => props.addBottomNode(props.id)}/>
    </div>
  );
});

const nodeContainerCss = css`
  position: relative;

  &:hover .drag-handle, & > div:focus + .drag-handle {
    transition: opacity 200ms ease-in;
    visibility: visible;
    opacity: 1;
  }
`;

const nodeCss = css`
  padding: 3px 7px;

  &:empty:after {
    content: attr(placeholder);
    color: rgba(55, 53, 47, 0.5);
    font-size: 16px;
  }

  &:focus {
    outline: none;
  }
`;
