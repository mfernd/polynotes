import { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { css } from '@emotion/react';
import { MainFrame } from '@components/MainFrame';
import { EditorManager } from '@components/editor/EditorManager';
import { RootState } from '@/store';
import { useLoaderData } from 'react-router-dom';
import { Page } from '@/typings/page.type';

export const EditorPage = () => {
  // const { pageId } = useParams();

  const page = useLoaderData() as Page;
  const editor = useSelector((state: RootState) => state.editor);
  const [pageTitle, setPageTitle] = useState(page.title);

  const exportPage = useCallback(() => {
    const nodes = editor.nodes;
    console.log(JSON.stringify({ pageTitle, nodes }));
  }, [pageTitle, editor.nodes]);

  return (
    <MainFrame titlePage={pageTitle === '' ? 'Sans titre' : pageTitle}>
      <div css={css`padding-left: 2.5rem;`}>
        <div css={pageTitleCss}>
          <input role={'heading'}
                 value={pageTitle}
                 onChange={(newTitle) => setPageTitle(newTitle.target.value)}
                 placeholder={'Sans titre'}/>
        </div>

        <button onClick={exportPage}>Sauvegarder</button>

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

const pageTitleCss = css`
  cursor: text;
  margin: 1rem 0 2rem 7px;

  input {
    border: none;
    width: 100%;
    font-size: 3.4rem;
    font-weight: 700;

    &::placeholder {
      color: rgba(55, 53, 47, 0.3);
    }
  }
`;
