import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { EditorNode } from '@components/editor/EditorNode';

export const EditorManager = () => {
  const editor = useSelector((state: RootState) => state.editor);

  return (
    <>
      {editor.nodes.map((node, index) => (
        <EditorNode key={node.id}
                    block={node}
                    isLastNode={index === editor.nodes.length - 1}/>
      ))}
    </>
  );
};