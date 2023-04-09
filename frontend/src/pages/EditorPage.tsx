import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLoaderData } from 'react-router-dom';
import { useToasts } from '@geist-ui/core';
import { css } from '@emotion/react';
import { MainFrame } from '@components/MainFrame';
import { EditorManager } from '@components/editor/EditorManager';
import { RootState } from '@/store';
import { Page } from '@/typings/page.type';
import { initEditor } from '@/features/editorSlice';
import { FetchError, useApi } from '@hooks/useApi';
import { useDebounce } from 'react-use';
import { EditorToolbar } from '@components/editor/EditorToolbar';

export const EditorPage = () => {
  const page = useLoaderData() as Page;
  const { setToast } = useToasts();
  const { pages: { apiUpsertPage } } = useApi();
  const editor = useSelector((state: RootState) => state.editor);
  const dispatch = useDispatch();
  const [pageTitle, setPageTitle] = useState(page.title);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    dispatch(initEditor({
      focusedNode: page.nodes[0].uuid,
      cursorIndex: 'end',
      nodes: page.nodes,
    }));
  }, []);

  const [firstLoad, setFirstLoad] = useState(false);
  useDebounce(() => {
    if (!firstLoad) {
      setFirstLoad(true);
      return;
    }
    setIsSaving(true);
    apiUpsertPage(page.uuid, pageTitle, editor.nodes)
      .catch(({ error }: FetchError) => setToast({ type: 'warning', text: error }))
      .finally(() => setIsSaving(false));
  }, 1000, [page.uuid, pageTitle, editor.nodes]);

  return (
    <MainFrame titlePage={pageTitle === '' ? 'Sans titre' : pageTitle}>
      <div css={css`padding-left: 2.5rem;`}>
        <EditorToolbar uuid={page.uuid} isSaving={isSaving}/>

        <div css={pageTitleCss}>
          <input role={'heading'}
                 value={pageTitle}
                 onChange={(newTitle) => setPageTitle(newTitle.target.value)}
                 placeholder={'Sans titre'}/>
        </div>

        <div css={editorContainerCss}>
          <EditorManager/>
        </div>
      </div>
    </MainFrame>
  );
};

const pageTitleCss = css`
  cursor: text;
  margin: 70px 0 1.25rem;

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
