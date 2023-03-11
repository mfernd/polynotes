import { DefaultBlockProps } from '@/typings/editor.type';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { EditorContent, useEditor } from '@tiptap/react';
import { Document } from '@tiptap/extension-document';
import { Text } from '@tiptap/extension-text';
import { Heading } from '@tiptap/extension-heading';
import { updateFocus } from '@/features/editorSlice';
import { useEffect } from 'react';
import { css } from '@emotion/react';
import { shouldShowPlaceholder } from '@/utils/shouldShowPlaceholder';

export const HeadingBlock = (props: DefaultBlockProps) => {
  const editorState = useSelector((state: RootState) => state.editor);
  const dispatch = useDispatch();

  const editor = useEditor({
    extensions: [
      Document.extend({
        content: 'heading',
      }),
      Text,
      Heading.configure({
        levels: [1, 2, 3],
      }),
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
      ${headingBlockCss};
      ${shouldShowPlaceholder(true, editor?.isFocused, editor?.isEmpty)
              ? placeholderCss(1)
              : undefined};
    `}>
      <EditorContent editor={editor} onKeyDown={(e) => props.onInput(e, editor)}/>
    </div>
  );
};

const headingBlockCss = css`
  margin-top: 2em;
  margin-bottom: 4px;
  
  h1 {
    margin: 0;
    font-size: 1.875em;
    font-weight: 700;
  }
`;

const placeholderCss = (level: number) => css`
  [contenteditable]:before {
    content: 'Titre ${level}';
    color: rgba(38, 37, 34, 0.4);
    font-size: 1.875em;
    font-weight: 700;

    float: left;
    height: 0;
    pointer-events: none;
  }
`;