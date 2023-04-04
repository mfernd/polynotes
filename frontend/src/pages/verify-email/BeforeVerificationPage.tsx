import { Center } from '@components/ui/Center';
import { Card } from '@components/ui/Card';
import { css } from '@emotion/react';

export const BeforeVerificationPage = () => {
  return (
    <Center>
      <main css={mainCss}>
        <Card title={'Vérification de votre compte 🔎'} showLogo>
          <h2>Félicitations, vous êtes maintenant inscrit{' '}!</h2>
          <p>Avant de pouvoir accéder à Polynotes, veuillez vérifier votre adresse e-mail en cliquant sur le lien que nous venons de vous envoyer.</p>
          <p>Si vous n'avez pas reçu d'e-mail, veuillez vérifier votre dossier de courrier indésirable ou réessayer de vous inscrire avec une autre
            adresse e-mail.</p>
        </Card>
      </main>
    </Center>
  );
};

const mainCss = css`
  width: 100%;
  max-width: 700px;
  text-align: justify;

  h1 {
    font-size: 2rem;
  }

  h2 {
    font-size: 1.4rem;
  }

  p {
    font-size: 1.2rem;
  }
`;
