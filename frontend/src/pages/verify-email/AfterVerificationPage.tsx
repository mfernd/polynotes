import { NavLink, useParams } from 'react-router-dom';
import { Card } from '@components/ui/Card';
import { Center } from '@components/ui/Center';
import { css } from '@emotion/react';
import { FetchError, useApi } from '@hooks/useApi';
import { useToasts } from '@geist-ui/core';
import { useEffect } from 'react';

export const AfterVerificationPage = () => {
  const { userUuid, nonce } = useParams();

  const { setToast } = useToasts();
  const { auth: { apiVerifyEmail } } = useApi();

  useEffect(() => {
    if (userUuid && nonce) {
      apiVerifyEmail(userUuid, nonce)
        .then(({ message }) => setToast({ type: 'success', text: message }))
        .catch((data: FetchError) => setToast({ type: 'error', text: data.error }));
    } else {
      setToast({ type: 'warning', text: 'Lien de vérification corrompu...' });
    }
  }, []);

  return (
    <Center>
      <main css={mainCss}>
        <Card title={'Compte vérifié ! 🎉'} showLogo>
          <h2>Félicitations{' '}!</h2>
          <p>Votre adresse e-mail a été vérifiée et vous pouvez maintenant accéder à Polynotes. 📝</p>
          <p><NavLink to={'/login'} className={'nav-link'}>Connectez-vous</NavLink> avec vos identifiants pour commencer à utiliser notre service.</p>
          <p>Si vous rencontrez des problèmes de connexion ou si vous avez des questions, n'hésitez pas à nous contacter.</p>
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
