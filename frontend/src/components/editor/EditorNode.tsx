import { KeyboardEvent, useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { css } from '@emotion/react';
import { addBottomNode, deleteNode, onArrow, setData, updateFocus } from '@/features/editorSlice';
import { EditorContent, useEditor } from '@tiptap/react';
import { Document } from '@tiptap/extension-document';
import { Paragraph } from '@tiptap/extension-paragraph';
import { Text } from '@tiptap/extension-text';
import { Placeholder } from '@tiptap/extension-placeholder';
import { Node } from '@/typings/editor.type';
import { DragHandle } from '@components/editor/DragHandle';

type EditorNodeProps = Node & {
  isFocused?: boolean;
  isLastNode?: boolean;
};

export const EditorNode = (props: EditorNodeProps) => {
  const dispatch = useDispatch();

  const editor = useEditor({
    extensions: [
      Document.extend({
        addKeyboardShortcuts: () => ({ 'Enter': () => true }),
      }),
      Paragraph,
      Text,
      Placeholder.configure({
        placeholder: props.isLastNode ? 'Appuyez sur / pour afficher les commandes…' : undefined,
      }),
    ],
    content: props.data,
  });

  useEffect(() => {
    if (props.isFocused)
      editor?.commands.focus();
  }, [editor, props.isFocused]);

  const kbdListener = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
    if (e.shiftKey) return;
    const selection = window.getSelection();

    if (e.key === 'Enter') {
      e.preventDefault();
      dispatch(addBottomNode());
    } else if (e.key === 'Backspace' && editor?.isEmpty) {
      e.preventDefault();
      dispatch(deleteNode());
    } else if (e.key === 'ArrowUp' && selection?.isCollapsed) {
      e.preventDefault();
      dispatch(onArrow(true));
    } else if (e.key === 'ArrowDown' && selection?.isCollapsed) {
      e.preventDefault();
      dispatch(onArrow(false));
    } else {
      if (!editor) return;
      dispatch(setData(editor.getHTML()));
    }
  }, [editor]);

  return (
    <div data-node-id={props.id} css={nodeContainerCss}>
      <EditorContent editor={editor}
                     onFocus={() => dispatch(updateFocus(props.id))}
                     onKeyDown={kbdListener}/>
      <DragHandle onPlusClick={() => dispatch(addBottomNode())}/>
    </div>
  );
};

const nodeContainerCss = css`
  position: relative;
  background-color: rgba(0 0 0 / 2%);
  border-radius: .5rem;

  &:hover .drag-handle /*, & > :focus + .drag-handle*/ {
    transition: opacity 200ms ease-in;
    visibility: visible;
    opacity: 1;
  }

  .ProseMirror {
    padding: 3px 7px;

    p {
      margin: 0;

      &.is-editor-empty:before {
        margin: 0;
        content: attr(data-placeholder);
        color: rgba(55, 53, 47, 0.5);
        font-size: 16px;
        float: left;
        height: 0;
        pointer-events: none;
      }
    }

    &:focus {
      outline: none;
    }
  }
`;
