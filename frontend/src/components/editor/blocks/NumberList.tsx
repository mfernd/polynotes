import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { EditorContent, useEditor } from '@tiptap/react';
import { Document } from '@tiptap/extension-document';
import { Text } from '@tiptap/extension-text';
import { HardBreak } from '@tiptap/extension-hard-break';
import { Bold } from '@tiptap/extension-bold';
import { Italic } from '@tiptap/extension-italic';
import { Strike } from '@tiptap/extension-strike';
import { Code } from '@tiptap/extension-code';
import { History } from '@tiptap/extension-history';
import { RootState } from '@/store';
import { updateFocus } from '@/features/editorSlice';
import { DefaultBlockProps } from '@/typings/editor.type';
import { shouldShowPlaceholder } from '@/utils/shouldShowPlaceholder';
import { css } from '@emotion/react';

export const NumberList = (props: DefaultBlockProps) => {
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
      Code.configure({
        HTMLAttributes: {
          spellcheck: false,
        },
      }),
      History,
    ],
    onFocus: () => dispatch(updateFocus(props.node.uuid)),
    content: props.node.data,
  });

  useEffect(() => {
    const isFocused = props.node.uuid === editorState.focusedNode;
    if (isFocused)
      editor?.commands.focus(editorState.cursorIndex);
  }, [editorState, editor]);

  return (
    <div css={css`
      ${numberListBlockCss};
      ${shouldShowPlaceholder(props.showPlaceholder, editor?.isFocused, editor?.isEmpty)
              ? placeholderCss
              : undefined};
    `}>
      <EditorContent editor={editor}
                     onKeyDown={(e) => props.onBeforeInput && props.onBeforeInput(e, editor)}
                     onKeyUp={(e) => props.onAfterInput && props.onAfterInput(e, editor)}/>
    </div>
  );
};

const numberListBlockCss = css`
  display: flex;
  align-items: center;
  margin-left: 15px;
  
  &::before {
    content: "1.";
    font-size: 1rem;
    font-weight: bolder;
  }
  
  & > div {
    flex: 1;
    display: inline-block;
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
