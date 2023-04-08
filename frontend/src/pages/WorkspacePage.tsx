import React, { useCallback, useEffect, useMemo } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { css } from '@emotion/react';
import { useDispatch, useSelector } from 'react-redux';
import { useToasts } from '@geist-ui/core';
import { FiPlus } from 'react-icons/all';
import { Tile } from '@components/ui/Tile';
import { MainFrame } from '@components/MainFrame';
import { PageTable } from '@components/ui/PageTable';
import { Card } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { FetchError, useApi } from '@hooks/useApi';
import { RootState } from '@/store';
import { updateRecentPages, updateUserPages } from '@/features/pagesSlice';
import { ShortPage } from '@/typings/page.type';

export const WorkspacePage = () => {
  const pagesState = useSelector((state: RootState) => state.pages);
  const dispatch = useDispatch();
  const { pages: { apiUpsertPage } } = useApi();
  const navigate = useNavigate();
  const { setToast } = useToasts();

  const [userPages, recentPages] = useLoaderData() as ShortPage[][];
  useEffect(() => {
    dispatch(updateUserPages(userPages));
    dispatch(updateRecentPages(recentPages));
  }, []);

  const createPage = useCallback(() => {
    apiUpsertPage()
      .then(({ pageUuid }) => navigate(`/pages/${pageUuid}`))
      .catch(({ error }: FetchError) => setToast({ type: 'warning', text: error }));
  }, [navigate, apiUpsertPage]);

  const recentPageTiles = useMemo(() => {
    if (pagesState.recentPages.length === 0) return null;
    return (
      <section css={recentTilesSectionCss}>
        <h2>Récents</h2>
        <div css={tilesCss}>
          {pagesState.recentPages.map((page, i) => (
            <Tile key={i}
                  title={page.title === '' ? 'Sans titre' : page.title}
                  updatedAt={new Date(page.updatedAt * 1000)}
                  link={`/pages/${page.uuid}`}/>
          ))}
        </div>
      </section>);
  }, [pagesState.recentPages]);

  const pagesNavigator = useMemo(() => {
    if (pagesState.userPages.length === 0) {
      return (
        <div css={containerNoPageCss}>
          <Card cardContentCss={noPagesCss}>
            <span css={noPagesEmojiCss}>⛱</span>
            <div css={css`flex: 1;`}>Vous n'avez pas encore créé de page…</div>
          </Card>
          <Button buttonProperties={{ initHeight: 1, addHeight: 1, isFullWidth: false }}
                  onClick={createPage}>
            <FiPlus/>
            <span>Créer une page</span>
          </Button>
        </div>);
    }
    return (
      <PageTable/>
    );
  }, [pagesState.userPages]);

  return (
    <MainFrame titlePage={'Workspace'}>
      <div css={containerCss}>
        <h1 css={css`margin: 0;`}>Mon espace de travail</h1>
        {recentPageTiles}
        {pagesNavigator}
      </div>
    </MainFrame>
  );
};

const containerCss = css`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const recentTilesSectionCss = css`
  max-width: 100%;
  margin-bottom: 1rem;

  & > h2 {
    cursor: default;
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
  }
`;

const tilesCss = css`
  display: flex;
  gap: 1rem;
  width: 100%;
  overflow-x: scroll;

  &::-webkit-scrollbar {
    display: none;
  }
`;

// NO PAGE CSS
const containerNoPageCss = css`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding-bottom: 25%;
`;

const noPagesCss = css`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1.5rem;
`;

const noPagesEmojiCss = css`
  font-size: 4rem;
`;

