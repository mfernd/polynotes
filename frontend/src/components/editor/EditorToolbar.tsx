import { BsCloudCheck, FaTrash, MdSync } from 'react-icons/all';
import { Button as GeistButton, useToasts } from '@geist-ui/core';
import React, { useCallback } from 'react';
import { FetchError, useApi } from '@hooks/useApi';
import { useNavigate } from 'react-router-dom';
import { css } from '@emotion/react';

type EditorToolbarProps = {
  uuid?: string;
  isSaving: boolean;
};

export const EditorToolbar = (props: EditorToolbarProps) => {
  const navigate = useNavigate();
  const { setToast } = useToasts();
  const { pages: { apiDeletePage } } = useApi();

  const deletePage = useCallback((uuid?: string) => {
    if (!uuid) return;
    apiDeletePage(uuid)
      .then(({ message }) => setToast({ type: 'success', text: message }))
      .then(() => navigate('/workspace'))
      .catch(({ error }: FetchError) => setToast({ type: 'error', text: error }));
  }, [apiDeletePage, setToast]);

  return (
    <div css={toolbarCss}>
      <div css={isSavingCss}>
        {props.isSaving
          ? <><MdSync size={20}/><span>Enregistrement…</span></>
          : <><BsCloudCheck size={20}/>{' '}Enregistré</>}
      </div>
      <div>
        <GeistButton type={'error'}
                     title={'Supprimer'}
                     auto scale={1 / 3}
                     font={'12px'}
                     onClick={() => deletePage(props.uuid)}>
          <FaTrash/>
        </GeistButton>
      </div>
    </div>
  );
};

const toolbarCss = css`
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 50px;
  padding: 0 2rem;
  background-color: #fafafa;
  box-shadow: rgba(0 0 0 / 5%) 0px -1px 1px 0px inset;
`;

const isSavingCss = css`
  display: flex;
  align-items: center;
  gap: 5px;
`;
