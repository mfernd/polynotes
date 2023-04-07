import { MainFrame } from '@components/MainFrame';
import { NavLink } from 'react-router-dom';
import { Card } from '@components/ui/Card';
import { css } from '@emotion/react';
import travoltaLost from '@assets/images/travolta_lost.gif';

export const ContentNotFound = () => {
  return (
    <MainFrame titlePage={'Page inconnue'}>
      <div css={css`margin: auto; width: 700px;`}>
        <Card title={'Cette page n\'existe pas…'} cardContentCss={cardContentCss}>
          <div>
            <p>Eh oui, ça arrive de s'égarer.</p>
            <p>
              Revenir à l'<NavLink to={'/workspace'} className={'nav-link'}>Accueil</NavLink>.
            </p>
          </div>
          <div css={rightColumnCss}>
            <img src={travoltaLost} alt={'John Travolta perdu'}/>
          </div>
        </Card>
      </div>
    </MainFrame>
  );
};

const cardContentCss = css`
  display: flex;
  flex-wrap: wrap;
  gap: 5rem;
  font-size: 1.5rem;

  img {
    height: 200px;
  }
`;

const rightColumnCss = css`
  flex: 1;
  
  display: flex;
  align-items: start;
  justify-content: center;
`;
