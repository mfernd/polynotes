import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { EditorNode } from '@components/editor/EditorNode';

type EditorManagerProps = {
  onChange?: () => void;
};

export const EditorManager = ({ onChange }: EditorManagerProps) => {
  const editor = useSelector((state: RootState) => state.editor);

  return (
    <>
      {editor.nodes.map((node, index) => (
        <EditorNode key={index}
                    node={node}
                    isLastNode={index === editor.nodes.length - 1}
                    onChange={onChange}/>
      ))}
    </>
  );
};