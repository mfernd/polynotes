import { Editor, EditorContent, useEditor } from '@tiptap/react';
import { Document } from '@tiptap/extension-document';
import { Text } from '@tiptap/extension-text';
import { HardBreak } from '@tiptap/extension-hard-break';
import { Bold } from '@tiptap/extension-bold';
import { Italic } from '@tiptap/extension-italic';
import { Strike } from '@tiptap/extension-strike';
import { Dropcursor } from '@tiptap/extension-dropcursor';
import { Gapcursor } from '@tiptap/extension-gapcursor';
import { History } from '@tiptap/extension-history';
import { Placeholder } from '@tiptap/extension-placeholder';
import { updateFocus } from '@/features/editorSlice';
import { KeyboardEvent, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { css } from '@emotion/react';

type TextBlockProps = {
  id: string;
  data: string;
  onInput: (event: KeyboardEvent<HTMLDivElement>, editor: Editor | null) => void;
  showPlaceholder?: boolean;
};

export const TextBlock = (props: TextBlockProps) => {
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
      Placeholder,
    ],
    onFocus: () => dispatch(updateFocus(props.id)),
    content: props.data,
  });

  useEffect(() => {
    const isFocused = props.id === editorState.focusedNode;
    if (isFocused)
      editor?.commands.focus(editorState.cursorIndex);
  }, [editorState, editor]);

  return (
    <div css={css`
      ${textBlockCss};
      ${(props.showPlaceholder && !editor?.isFocused) || (editor?.isFocused && editor.isEmpty) ? placeholderCss : undefined};
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