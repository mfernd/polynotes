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

type TextBlockProps = {
  id: string;
  data: string;
  onInput: (event: KeyboardEvent<HTMLDivElement>, editor: Editor | null) => void;
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
      Placeholder.configure({
        placeholder: ({ editor }) => {
          return /*editor.isFocused ?*/ 'Appuyez sur / pour afficher les commandes…' /*: ''*/;
        },
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

  return <EditorContent editor={editor} onKeyDown={(e) => props.onInput(e, editor)}/>;
};