import { css } from '@emotion/react';
import { Tile } from '@components/ui/Tile';

export const MyWorkspace = () => {
  return (
    <>
      <h1 css={css`margin: 0;
        font-weight: 400;`}>Mon espace de travail</h1>

      <section css={recentTilesSectionCss}>
        <h2>Récents</h2>
        <div>
          <Tile imageUrl={'https://picsum.photos/250/250'}
                title={'PolyNotes - Projet Promotion 2022-23'}
                modifiedDate={new Date()}/>
          <Tile imageUrl={'https://picsum.photos/251/251'}
                title={'PolyNotes - Projet Promotion 2022-23'}
                modifiedDate={new Date()}/>
          <Tile imageUrl={'https://picsum.photos/252/252'}
                title={'PolyNotes - Projet Promotion 2022-23'}
                modifiedDate={new Date()}/>
          <Tile imageUrl={'https://picsum.photos/253/253'}
                title={'PolyNotes - Projet Promotion 2022-23'}
                modifiedDate={new Date()}/>
          <Tile imageUrl={'https://picsum.photos/254/254'}
                title={'PolyNotes - Projet Promotion 2022-23'}
                modifiedDate={new Date()}/>
          <Tile imageUrl={'https://picsum.photos/255/255'}
                title={'PolyNotes - Projet Promotion 2022-23'}
                modifiedDate={new Date()}/>
        </div>
      </section>
    </>
  );
};

const recentTilesSectionCss = css`
  & > h2 {
    cursor: default;
    font-size: 1.1rem;
    font-weight: 400;
    margin-bottom: 0.75rem;
  }

  & > div {
    display: flex;
    gap: 1rem;
    overflow-x: scroll;
  }
`;