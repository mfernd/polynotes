import { MainFrame } from '@components/MainFrame';
import { useParams } from 'react-router-dom';
import { css } from '@emotion/react';
import { DragHandle } from '@components/editor/DragHandle';

export const EditorPage = () => {
  const { pageId } = useParams();

  return (
    <MainFrame>
      <h1>Page "{pageId}"</h1>
      <div css={editorContainerCss}>
        <div css={cellContainerCss}>
          <div css={cellCss}
               contentEditable
               placeholder={'Appuyez sur / pour afficher les commandes…'}>
          </div>
          <DragHandle/>
        </div>
      </div>
    </MainFrame>
  );
};

const editorContainerCss = css`
  cursor: text;
  width: 100%;
  padding-left: 3rem;
  padding-bottom: 30vh;

  color: #37352F;
  caret-color: rgb(55, 53, 47);

  font-size: 16px;
  font-weight: 400;
  white-space: pre-wrap;
  word-break: break-word;
`;

const cellContainerCss = css`
  position: relative;
  
  &:hover .drag-handle, div:focus + .drag-handle {
    transition: opacity 50ms ease-in;
    visibility: visible;
    opacity: 1;
  }
`;

const cellCss = css`
  padding: 3px 2px;

  &:empty:after {
    content: attr(placeholder);
    color: #777;
  }

  &:focus {
    //outline: none;
  }
`;
