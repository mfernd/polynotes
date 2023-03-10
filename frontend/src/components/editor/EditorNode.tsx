import { KeyboardEvent, useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { css } from '@emotion/react';
import { addBottomNode, deleteNode, onArrow, updateCursor, updateData } from '@/features/editorSlice';
import { Node } from '@/typings/editor.type';
import { DragHandle } from '@components/editor/DragHandle';
import { TextBlock } from '@components/editor/blocks/TextBlock';
import { Editor } from '@tiptap/react';

export const EditorNode = (props: Node & { isLastNode?: boolean }) => {
  const dispatch = useDispatch();
  const [focused, setFocused] = useState(false);

  const kbdListener = useCallback((e: KeyboardEvent<HTMLDivElement>, editor: Editor | null) => {
    if (e.shiftKey) return;
    const selection = window.getSelection();
    dispatch(updateCursor(selection?.anchorOffset || 0));

    if (e.key === 'Enter') {
      e.preventDefault();
      dispatch(addBottomNode(props.id));
    } else if (['Backspace', 'Delete'].includes(e.key) && editor?.isEmpty) {
      e.preventDefault();
      dispatch(deleteNode());
    } else if (e.key === 'ArrowUp' && selection?.isCollapsed) {
      e.preventDefault();
      dispatch(onArrow({ orientation: 'up', cursorIndex: selection.anchorOffset }));
    } else if (e.key === 'ArrowDown' && selection?.isCollapsed) {
      e.preventDefault();
      dispatch(onArrow({ orientation: 'down', cursorIndex: selection.anchorOffset }));
    } else {
      if (!editor) return;
      dispatch(updateData(editor.getHTML()));
    }
    dispatch(updateCursor(selection?.anchorOffset || 0));
  }, []);

  let blockRendered: JSX.Element | undefined;
  switch (props.type) {
    case 'text':
      blockRendered = <TextBlock id={props.id} data={props.data} onInput={kbdListener} showPlaceholder={props.isLastNode}/>;
      break;
  }

  return (
    <div data-node-id={props.id}
         css={nodeContainerCss}
         onFocus={() => setFocused(true)}
         onBlur={() => setFocused(false)}
         onMouseEnter={() => setFocused(true)}
         onMouseLeave={() => setFocused(false)}>
      {blockRendered}
      <DragHandle show={focused} onPlusClick={() => dispatch(addBottomNode(props.id))}/>
    </div>
  );
};

const nodeContainerCss = css`
  position: relative;
  background-color: rgba(0 0 0 / 2%);
  border-bottom: 1px solid #505050;
  border-radius: .5rem;
`;
