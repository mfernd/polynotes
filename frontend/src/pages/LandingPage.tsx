import { css } from '@emotion/react';
import { useTitle } from 'react-use';
import { useNavigate } from 'react-router-dom';
import { appName } from '@/main';
import { Button } from '@components/ui/Button';
import { Center } from '@components/ui/Center';
import { Card } from '@components/ui/Card';
import logoLarge from '@assets/images/logo-large.svg';
import manifestoTxt from '@assets/texts/manifesto.txt?raw';

export const LandingPage = () => {
  const navigate = useNavigate();
  useTitle(`Welcome - ${appName}`);
  const maxWidth = 750;

  return (
    <Center>
      <div css={containerCss(maxWidth)}>
        <header css={headerCss}>
          <img src={logoLarge} alt={'PolyNotes large logo'}/>
        </header>

        <main css={mainCss}>
          <Card title={'Manifesto!'}
                cardContentCss={cardContentCss}>
            {manifestoTxt}
          </Card>

          <div css={css`transform: translateY(-50%);`}>
            <Button onClick={() => navigate('/login')}>START</Button>
          </div>
        </main>
      </div>
    </Center>
  );
};

const containerCss = (maxWidth: number) => css`
  padding-bottom: 4rem;
  width: 100%;
  max-width: ${maxWidth}px;
`;

const headerCss = css`
  margin-bottom: 1.5rem;

  display: flex;
  justify-content: center;

  img {
    width: 100%;
    max-width: 450px;
    image-rendering: pixelated;
  }
`;

const mainCss = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const cardContentCss = css`
  white-space: break-spaces;
  max-height: 400px;
  overflow-y: scroll;

  &::-webkit-scrollbar {
    display: none;
  }
`;
