import { useTitle } from 'react-use';
import { css } from '@emotion/react';
import { appName } from '@/main';
import { Button } from '@components/Button';
import { Center } from '@components/Center';
import { Card } from '@components/Card';
import { useState } from 'react';

export const LoginPage = () => {
  useTitle(`Login - ${appName}`);
  const maxWidth = 400;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <Center isVertical>
      <main css={{ width: '100%', maxWidth: maxWidth }}>
        <Card title={'Connexion'}>
          <form onSubmit={(e) => {
            e.preventDefault();
            console.log({ email, password });
          }}
                css={formLoginCss}>
            <div>
              <label css={columnCss}>
                <span>Email</span>
                <input type="email"
                       value={email}
                       onChange={(e) => setEmail(e.target.value)}
                       autoComplete={'email'}
                       placeholder={'john.doe@example.tld'}
                       tabIndex={1}
                       spellCheck={'false'}
                       css={inputCss}/>
              </label>

              <label css={columnCss}>
                <span>Mot de passe</span>
                <input type="password"
                       value={password}
                       onChange={(e) => setPassword(e.target.value)}
                       autoComplete={'current-password'}
                       tabIndex={2}
                       css={inputCss}/>
              </label>
            </div>

            <Button isSubmit>Se connecter</Button>
          </form>
        </Card>
      </main>
    </Center>
  );
};

const columnCss = css`
  display: flex;
  flex-direction: column;
`;

const formLoginCss = css`
  ${columnCss};
  gap: 1.5rem;

  label {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 1rem;

    span {
      margin-bottom: 0.25rem;
    }
  }
`;

const inputCss = css`
  width: 100%;
  padding: 1rem 1rem 0.8rem;
  box-sizing: border-box;

  background-color: #eee;
  color: #fe0096;
  font-size: 1.1rem;
  font-weight: 600;

  border: none;
  border-radius: 1rem;
  box-shadow: 0 3px #d8d8d8;

  &:focus {
    outline-color: #fe0096;
  }
`;

