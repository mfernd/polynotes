import { useState } from 'react';
import { useTitle } from 'react-use';
import { NavLink } from 'react-router-dom';
import { css } from '@emotion/react';
import { appName } from '@/main';
import { Button } from '@components/ui/Button';
import { Center } from '@components/ui/Center';
import { Card } from '@components/ui/Card';
import { Form } from '@components/ui/Form';
import { InputText } from '@components/ui/InputText';

export const LoginPage = () => {
  useTitle(`Login - ${appName}`);
  const maxWidth = 400;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <Center isVertical>
      <main css={{ width: '100%', maxWidth: maxWidth }}>
        <Card title={'Connexion'} showLogo>
          <Form onSubmit={() => console.log(email, password)}>
            <div>
              <InputText type={'email'}
                         labelTitle={'Email'}
                         value={email}
                         onChange={(e) => setEmail(e.target.value)}
                         autoComplete={'email'}
                         placeholder={'john.doe@example.tld'}
                         tabIndex={1}/>

              <InputText type={'password'}
                         labelTitle={'Mot de passe'}
                         value={password}
                         onChange={(e) => setPassword(e.target.value)}
                         autoComplete={'current-password'}
                         tabIndex={2}/>
            </div>

            <Button isSubmit>Se connecter</Button>

            <p css={redirectCss}>Pas de compte{' '}? <NavLink to={'/register'}>Créez un compte</NavLink></p>
          </Form>
        </Card>
      </main>
    </Center>
  );
};

const redirectCss = css`
  margin: 0;
  font-size: 1.1rem;

  a {
    color: #fe0096;
    font-weight: 700;

    &:hover {
      color: #e40087;
    }
  }
`;
