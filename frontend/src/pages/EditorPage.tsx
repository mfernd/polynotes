import { useParams } from 'react-router-dom';
import { css } from '@emotion/react';
import { MainFrame } from '@components/MainFrame';
import { EditorManager } from '@components/editor/EditorManager';

export const EditorPage = () => {
  const { pageId } = useParams();

  return (
    <MainFrame>
      <div css={css`padding-left: 2.5rem;`}>
        <h1>Nouvelle page <small>{pageId}</small></h1>

        <div css={editorContainerCss}>
          <EditorManager/>
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
