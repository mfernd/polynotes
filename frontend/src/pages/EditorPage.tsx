import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { css } from '@emotion/react';
import { MainFrame } from '@components/MainFrame';
import { EditorNode } from '@components/editor/EditorNode';
import { RootState } from '@/store';

export const EditorPage = () => {
  const { pageId } = useParams();
  const editor = useSelector((state: RootState) => state.editor);

  return (
    <MainFrame>
      <div css={css`padding-left: 2.5rem;`}>
        <h1>Nouvelle page <small>{pageId}</small></h1>

        <div css={editorContainerCss}>
          {editor.nodes.map((node, id) => (
            <EditorNode key={id}
                        id={node.id}
                        type={node.type}
                        isLastNode={id === editor.nodes.length - 1}
                        isFocused={id === editor.focusIndex}/>
          ))}
        </div>
      </div>
    </MainFrame>
  );
};

const editorContainerCss = css`
  cursor: text;
  padding-bottom: 30vh;

  color: rgb(55, 53, 47);
  caret-color: rgb(55, 53, 47);

  font-size: 16px;
  font-weight: 400;
  white-space: pre-wrap;
  word-break: break-word;
`;
