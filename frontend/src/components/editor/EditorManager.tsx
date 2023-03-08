import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { EditorNode } from '@components/editor/EditorNode';

export const EditorManager = () => {
  const editor = useSelector((state: RootState) => state.editor);

  return (
    <>
      {editor.nodes.map((node, id) => (
        <EditorNode key={id}
                    id={node.id}
                    type={node.type}
                    data={node.data}
                    isLastNode={id === editor.nodes.length - 1}
                    isFocused={id === editor.focusIndex}/>
      ))}
    </>
  );
};