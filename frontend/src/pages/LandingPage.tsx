import { css } from '@emotion/react';
import { Button } from '@components/Button';
import logoLarge from '@assets/logo-large.svg';

export function LandingPage() {
  const maxWidth = 750;

  return (
    <div css={css`padding-bottom: 4rem; max-width: ${maxWidth}px;`}>
      <header css={headerCss}>
        <img src={logoLarge} alt="PolyNotes large logo"/>
      </header>

      <main css={mainCss}>
        <article>
          <h1>Manifesto!</h1>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ea eveniet numquam optio placeat quo sapiente
            voluptates? Accusantium aut blanditiis eveniet itaque laborum nostrum officia repellat repudiandae
            temporibus totam. Id, voluptate!
          </p>
          <p>Esse est, excepturi maiores odio quis sunt temporibus veniam. Accusantium, aut beatae culpa dolore
            dolores ex facilis in incidunt ipsum minus possimus repellat suscipit ut vero voluptates? Architecto,
            obcaecati repellat.
          </p>
          <p>Eos harum illo nihil praesentium. Accusantium architecto blanditiis delectus distinctio exercitationem
            facere harum illo natus non numquam odio optio quam quidem quos ratione repellendus saepe, sunt unde ut vel
            voluptatibus?
          </p>
          <p>Ad adipisci commodi consectetur consequuntur delectus dicta eos est eveniet expedita fugiat inventore
            itaque laboriosam maxime, molestias neque numquam praesentium quis reprehenderit tempora tempore tenetur
            veniam voluptatem. Cumque, perspiciatis rem.
          </p>
        </article>

        <div css={css`transform: translateY(-50%);`}>
          <Button>START</Button>
        </div>
      </main>
    </div>
  );
}

const headerCss = css`
  margin-bottom: 1.5rem;

  display: flex;
  justify-content: center;

  img {
    width: 100%;
    max-width: 400px;
  }
`;

const mainCss = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  article {
    cursor: default;
    padding: 1rem 2rem;

    background-color: #fafbfb;
    border: 1px solid #d8d8d8;
    border-radius: 4px;
    box-shadow: 0 3px 0 #d8d8d8;

    h1, p {
      margin: 0.75rem;
      text-align: justify;
    }
  }
`;
