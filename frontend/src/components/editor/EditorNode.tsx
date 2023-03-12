import { KeyboardEvent, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { css } from '@emotion/react';
import { addBottomNode, deleteNode, onArrow, updateData } from '@/features/editorSlice';
import { Node } from '@/typings/editor.type';
import { DragHandle } from '@components/editor/DragHandle';
import { TextBlock } from '@components/editor/blocks/TextBlock';
import { Editor } from '@tiptap/react';
import { HeadingBlock } from '@components/editor/blocks/HeadingBlock';
import { CommandManager } from '@components/editor/commands/CommandManager';

type EditorNodeProps = {
  block: Node;
  isLastNode?: boolean;
};

export const EditorNode = (props: EditorNodeProps) => {
  const dispatch = useDispatch();
  const [focused, setFocused] = useState(false);

  const kbdListener = useCallback((e: KeyboardEvent<HTMLDivElement>, editor: Editor | null) => {
    if (e.shiftKey) return;
    if (null === editor) return;
    const selection = window.getSelection();

    if (e.key === 'Enter') {
      e.preventDefault();
      dispatch(addBottomNode(props.block.id));
    } else if (['Backspace', 'Delete'].includes(e.key) && editor.isEmpty) {
      e.preventDefault();
      dispatch(deleteNode());
    } else if (e.key === 'ArrowUp' && selection?.isCollapsed) {
      e.preventDefault();
      dispatch(onArrow({ orientation: 'up', cursorIndex: selection.anchorOffset }));
    } else if (e.key === 'ArrowDown' && selection?.isCollapsed) {
      e.preventDefault();
      dispatch(onArrow({ orientation: 'down', cursorIndex: selection.anchorOffset }));
    } else if (e.key === 'ArrowLeft' && selection?.isCollapsed && selection?.anchorOffset === 0) {
      dispatch(onArrow({ orientation: 'up', cursorIndex: 'end' }));
    } else if (e.key === 'ArrowRight' && selection?.isCollapsed && selection?.anchorOffset === editor.getText().length) {
      dispatch(onArrow({ orientation: 'down', cursorIndex: 'start' }));
    } else {
      dispatch(updateData(editor.getHTML()));
    }
  }, []);

  let blockRendered: JSX.Element | undefined;
  switch (props.block.type) {
    case 'text':
      blockRendered = <TextBlock block={props.block} onInput={kbdListener} showPlaceholder={props.isLastNode}/>;
      break;
    case 'header-1':
      blockRendered = <HeadingBlock block={props.block} level={1} onInput={kbdListener} showPlaceholder={props.isLastNode}/>;
      break;
    case 'header-2':
      blockRendered = <HeadingBlock block={props.block} level={2} onInput={kbdListener} showPlaceholder={props.isLastNode}/>;
      break;
    case 'header-3':
      blockRendered = <HeadingBlock block={props.block} level={3} onInput={kbdListener} showPlaceholder={props.isLastNode}/>;
      break;
  }

  return (
    <div data-node-id={props.block.id}
         css={nodeContainerCss}
         onFocus={() => setFocused(true)}
         onBlur={() => setFocused(false)}
         onMouseEnter={() => setFocused(true)}
         onMouseLeave={() => setFocused(false)}>
      {blockRendered}
      <DragHandle nodeId={props.block.id} show={focused}/>
      <CommandManager nodeId={props.block.id} query={'test'} show={props.isLastNode}/>
    </div>
  );
};

const nodeContainerCss = css`
  position: relative;
  background-color: rgba(0 0 0 / 2%);
  border-bottom: 1px solid #505050;
  border-radius: .5rem;

  .ProseMirror {
    padding: 3px 7px;

    &:focus {
      outline: none;
    }
  }
`;
