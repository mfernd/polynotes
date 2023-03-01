import { css } from '@emotion/react';
import { useTitle } from 'react-use';
import { useNavigate } from 'react-router-dom';
import { appName } from '@/main';
import { Button } from '@components/Button';
import { Center } from '@components/Center';
import { Card } from '@components/Card';
import logoLarge from '@assets/logo-large.svg';

export const LandingPage = () => {
  const navigate = useNavigate();
  useTitle(`Welcome - ${appName}`);
  const maxWidth = 750;

  return (
    <Center>
      <div css={containerCss(maxWidth)}>
        <header css={headerCss}>
          <img src={logoLarge} alt="PolyNotes large logo"/>
        </header>

        <main css={mainCss}>
          <Card title={'Manifesto!'}>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ea eveniet numquam optio placeat quo sapiente
              voluptates? Accusantium aut blanditiis eveniet itaque laborum nostrum officia repellat repudiandae
              temporibus totam. Id, voluptate!
            </p>
            <p>Esse est, excepturi maiores odio quis sunt temporibus veniam. Accusantium, aut beatae culpa dolore
              dolores ex facilis in incidunt ipsum minus possimus repellat suscipit ut vero voluptates? Architecto,
              obcaecati repellat.
            </p>
            <p>Eos harum illo nihil praesentium. Accusantium architecto blanditiis delectus distinctio exercitationem
              facere harum illo natus non numquam odio optio quam quidem quos ratione repellendus saepe, sunt unde ut
              vel
              voluptatibus?
            </p>
            <p>Ad adipisci commodi consectetur consequuntur delectus dicta eos est eveniet expedita fugiat inventore
              itaque laboriosam maxime, molestias neque numquam praesentium quis reprehenderit tempora tempore tenetur
              veniam voluptatem. Cumque, perspiciatis rem.
            </p>
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
