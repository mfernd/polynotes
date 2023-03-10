import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { EditorNode } from '@components/editor/EditorNode';
import { useId } from 'react';

export const EditorManager = () => {
  const editor = useSelector((state: RootState) => state.editor);

  return (
    <>
      {editor.nodes.map((node) => (
        <EditorNode key={node.id}
                    id={node.id}
                    type={node.type}
                    data={node.data}/>
      ))}
    </>
  );
};