import { EditorContent, useEditor } from '@tiptap/react';
import { Document } from '@tiptap/extension-document';
import { Text } from '@tiptap/extension-text';
import { HardBreak } from '@tiptap/extension-hard-break';
import { Bold } from '@tiptap/extension-bold';
import { Italic } from '@tiptap/extension-italic';
import { Strike } from '@tiptap/extension-strike';
import { Dropcursor } from '@tiptap/extension-dropcursor';
import { Gapcursor } from '@tiptap/extension-gapcursor';
import { History } from '@tiptap/extension-history';
import { updateFocus } from '@/features/editorSlice';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { css } from '@emotion/react';
import { DefaultBlockProps } from '@/typings/editor.type';
import { shouldShowPlaceholder } from '@/utils/shouldShowPlaceholder';

export const TextBlock = (props: DefaultBlockProps) => {
  const editorState = useSelector((state: RootState) => state.editor);
  const dispatch = useDispatch();

  const editor = useEditor({
    extensions: [
      Document.extend({
        content: 'inline*',
      }),
      Text,
      HardBreak,
      Bold,
      Italic,
      Strike,
      Dropcursor,
      Gapcursor,
      History,
    ],
    onFocus: () => dispatch(updateFocus(props.block.id)),
    content: props.block.data,
  });

  useEffect(() => {
    const isFocused = props.block.id === editorState.focusedNode;
    if (isFocused)
      editor?.commands.focus(editorState.cursorIndex);
  }, [editorState, editor]);

  return (
    <div css={css`
      ${textBlockCss};
      ${shouldShowPlaceholder(props.showPlaceholder, editor?.isFocused, editor?.isEmpty)
              ? placeholderCss
              : undefined};
    `}>
      <EditorContent editor={editor} onKeyDown={(e) => props.onInput(e, editor)}/>
    </div>
  );
};

const textBlockCss = css`
  .ProseMirror {
    padding: 3px 7px;

    &:focus {
      outline: none;
    }
  }
`;

const placeholderCss = css`
  [contenteditable]:before {
    margin: 0;
    content: 'Appuyez sur / pour afficher les commandes…';
    color: rgba(55, 53, 47, 0.5);
    font-size: 16px;
    float: left;
    height: 0;
    pointer-events: none;
  }
`;