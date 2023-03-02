import { useTitle } from 'react-use';
import { appName } from '@/main';
import { Button } from '@components/ui/Button';
import { Center } from '@components/ui/Center';
import { Card } from '@components/ui/Card';
import { useState } from 'react';
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
          </Form>
        </Card>
      </main>
    </Center>
  );
};
