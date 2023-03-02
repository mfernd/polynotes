import { useTitle } from 'react-use';
import { appName } from '@/main';
import { useState } from 'react';
import { Center } from '@components/ui/Center';
import { Card } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { Form } from '@components/ui/Form';
import { InputText } from '@components/ui/InputText';
import { InputCheckbox } from '@components/ui/InputCheckbox';

export const RegisterPage = () => {
  useTitle(`Register - ${appName}`);
  const maxWidth = 400;

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState(false);
  const [cgu, setCgu] = useState(false);

  return (
    <Center isVertical>
      <main css={{ width: '100%', maxWidth: maxWidth }}>
        <Card title={'Inscription'} showLogo>
          <Form onSubmit={() => console.log({ username, email, password, age, cgu })}>
            <div>
              <InputText type={'text'}
                         labelTitle={'Pseudo'}
                         value={username}
                         onChange={(e) => setUsername(e.target.value)}
                         autoComplete={'username'}
                         placeholder={'john.doe'}
                         tabIndex={1}/>

              <InputText type={'email'}
                         labelTitle={'Email'}
                         value={email}
                         onChange={(e) => setEmail(e.target.value)}
                         autoComplete={'email'}
                         placeholder={'john.doe@example.tld'}
                         tabIndex={2}/>

              <InputText type={'password'}
                         labelTitle={'Mot de passe'}
                         value={password}
                         onChange={(e) => setPassword(e.target.value)}
                         autoComplete={'current-password'}
                         tabIndex={3}/>

              <InputCheckbox labelTitle={'+13 y.o'}
                             value={age}
                             onChange={(e) => setAge(e.target.checked)}/>

              <InputCheckbox labelTitle={'Accepter les CGUs'}
                             value={cgu}
                             onChange={(e) => setCgu(e.target.checked)}/>
            </div>

            <Button isSubmit>S'inscrire</Button>
          </Form>
        </Card>
      </main>
    </Center>
  );
};