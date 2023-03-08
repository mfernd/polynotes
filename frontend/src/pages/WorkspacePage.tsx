import { css } from '@emotion/react';
import { v4 as uuidv4 } from 'uuid';
import { Tile } from '@components/ui/Tile';
import { MainFrame } from '@components/MainFrame';

export const WorkspacePage = () => {
  const tiles = [];
  for (let i = 0; i < 10; i++) {
    tiles.push(
      <Tile key={i} imageUrl={`https://picsum.photos/25${i}/25${i}`}
            title={'PolyNotes - Projet Promotion 2022-23'}
            modifiedDate={new Date()}
            link={`/page/${uuidv4()}`}/>);
  }

  return (
    <MainFrame titlePage={'Workspace'}>
      <h1 css={css`margin: 0;`}>Mon espace de travail</h1>

      <section css={recentTilesSectionCss}>
        <h2>Récents</h2>
        <div css={tilesCss}>
          {tiles}
        </div>
      </section>
    </MainFrame>
  );
};

const recentTilesSectionCss = css`
  max-width: 100%;

  & > h2 {
    cursor: default;
    font-size: 1.1rem;
    font-weight: 400;
    margin-bottom: 0.75rem;
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
