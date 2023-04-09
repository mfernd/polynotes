import React, { useCallback, useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { AiFillFile, FaTrash } from 'react-icons/all';
import { Button as GeistButton, Table, Text, useToasts } from '@geist-ui/core';
import { css } from '@emotion/react';
import { useDispatch, useSelector } from 'react-redux';
import { FetchError, useApi } from '@hooks/useApi';
import { removeFromPages } from '@/features/pagesSlice';
import { RootState } from '@/store';

export const PageTable = () => {
  const userPages = useSelector((state: RootState) => state.pages.userPages);
  const dispatch = useDispatch();

  const { pages: { apiDeletePage } } = useApi();
  const { setToast } = useToasts();

  const deletePage = useCallback((uuid: string) => {
    apiDeletePage(uuid)
      .then(({ message }) => setToast({ type: 'success', text: message }))
      .then(() => dispatch(removeFromPages(uuid)))
      .catch(({ error }: FetchError) => setToast({ type: 'error', text: error }));
  }, [apiDeletePage, setToast, userPages]);

  const tableData = useMemo(() => {
    return userPages.map((page) => {
      const dateFormat = new Intl.DateTimeFormat('fr', { dateStyle: 'medium', timeStyle: 'medium' });
      const updatedAt = new Date(page.updatedAt * 1000);
      const createdAt = new Date(page.createdAt * 1000);

      return {
        uuid: page.uuid,
        title: (
          <NavLink to={`/pages/${page.uuid}`} css={tableLinkCss} title={page.title}>
            <AiFillFile size={'18px'}/><span>{page.title === '' ? 'Sans titre' : page.title}</span>
          </NavLink>),
        author: <div>moi</div>,
        createdAt: <Text type={'secondary'}>{dateFormat.format(updatedAt)}</Text>,
        updatedAt: <Text type={'secondary'}>{dateFormat.format(createdAt)}</Text>,
        actions: (
          <GeistButton type={'error'}
                       title={'Supprimer'}
                       auto scale={1 / 3}
                       font={'12px'}
                       onClick={() => deletePage(page.uuid)}>
            <FaTrash/>
          </GeistButton>),
      };
    });
  }, [userPages]);

  return (
    <Table data={tableData} css={tableCss}>
      <Table.Column prop={'title'} label={'Titre'}/>
      <Table.Column prop={'author'} label={'Auteur'}/>
      <Table.Column prop={'updatedAt'} label={'Dernière modification'}/>
      <Table.Column prop={'createdAt'} label={'Créé le'}/>
      <Table.Column prop={'actions'} label={'Actions'}/>
    </Table>
  );
};

const tableCss = css`
  td:nth-of-type(1) {
    max-width: 100px;
  }
`;

const tableLinkCss = css`
  display: flex;
  align-items: start;
  gap: 5px;
  color: rgb(60, 64, 67);
  max-width: 100%;

  &:hover {
    color: #fe0096;
  }
  
  span {
    max-width: 75%;
    overflow-x: clip;
    text-overflow: ellipsis;
  }
`;
