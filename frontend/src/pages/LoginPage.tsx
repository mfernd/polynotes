import { useTitle } from 'react-use';
import { NavLink } from 'react-router-dom';
import { css } from '@emotion/react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { Input } from '@geist-ui/core';
import { appName } from '@/main';
import { Button } from '@components/ui/Button';
import { Center } from '@components/ui/Center';
import { Card } from '@components/ui/Card';
import { Form } from '@components/ui/Form';
import { InputWrapper } from '@components/ui/InputWrapper';

export const LoginPage = () => {
  useTitle(`Login - ${appName}`);
  const maxWidth = 400;

  const { register, handleSubmit } = useForm();
  const onSubmit: SubmitHandler<FieldValues> = (data) => console.log(data);

  return (
    <Center isVertical>
      <main css={{ width: '100%', maxWidth: maxWidth }}>
        <Card title={'Connexion'} showLogo>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <InputWrapper labelTitle={'Email'}>
                <Input scale={4 / 3}
                       htmlType={'email'}
                       autoComplete={'email'}
                       placeholder={'john.doe@example.tld'}
                       width={'100%'}
                       tabIndex={1}
                       {...register('email', { required: true })}/>
              </InputWrapper>

              <InputWrapper labelTitle={'Mot de passe'}>
                <Input.Password scale={4 / 3}
                                autoComplete={'current-password'}
                                width={'100%'}
                                tabIndex={2}
                                {...register('password', { required: true })}/>
              </InputWrapper>
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
