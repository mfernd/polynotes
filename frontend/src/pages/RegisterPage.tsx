import { useTitle } from 'react-use';
import { NavLink, useNavigate } from 'react-router-dom';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { Input, Link, useToasts } from '@geist-ui/core';
import { css } from '@emotion/react';
import { appName } from '@/main';
import { FetchError, useApi } from '@hooks/useApi';
import { Center } from '@components/ui/Center';
import { Card } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { Form } from '@components/ui/Form';
import { InputWrapper } from '@components/ui/InputWrapper';
import { InputCheckbox } from '@components/ui/InputCheckbox';

export const RegisterPage = () => {
  useTitle(`Register - ${appName}`);
  const maxWidth = 400;

  const { setToast } = useToasts();
  const { auth: { apiRegister } } = useApi();
  const navigate = useNavigate();

  const { register, handleSubmit } = useForm();
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    apiRegister(data.username, data.email, data.password, data.age, data.cgu)
      .then(() => navigate('/verify-email')) // redirect to verify email
      .catch((data: FetchError) => setToast({ type: 'error', text: data.error }));
  };

  return (
    <Center isVertical>
      <main css={{ width: '100%', maxWidth: maxWidth }}>
        <Card title={'Inscription'} showLogo>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <InputWrapper labelTitle={'Pseudo'}>
                <Input scale={4 / 3}
                       autoComplete={'username'}
                       placeholder={'john.doe'}
                       width={'100%'}
                       tabIndex={1}
                       {...register('username', { required: true })}/>
              </InputWrapper>

              <InputWrapper labelTitle={'Email'}>
                <Input scale={4 / 3}
                       autoComplete={'email'}
                       placeholder={'john.doe@example.tld'}
                       width={'100%'}
                       tabIndex={2}
                       {...register('email', { required: true })}/>
              </InputWrapper>

              <InputWrapper labelTitle={'Mot de passe'}>
                <Input.Password scale={4 / 3}
                                autoComplete={'current-password'}
                                width={'100%'}
                                tabIndex={3}
                                {...register('password', { required: true })}/>
              </InputWrapper>

              <InputCheckbox labelTitle={'J\'assure avoir plus de 13 ans'}
                             tabIndex={4}
                             registerHandle={register}
                             registerParams={{ name: 'age' }}/>

              <InputCheckbox labelTitle={<span>J'accepte les <Link href={'/cgu'} target={'_blank'} className={'nav-link'} icon>CGUs</Link></span>}
                             tabIndex={5}
                             registerHandle={register}
                             registerParams={{ name: 'cgu' }}/>
            </div>

            <Button isSubmit>S'inscrire</Button>

            <p css={redirectCss}>Déjà un compte{' '}? <NavLink to={'/login'} className={'nav-link'}>Se connecter</NavLink></p>
          </Form>
        </Card>
      </main>
    </Center>
  );
};

const redirectCss = css`
  margin: 0;
  font-size: 1.1rem;
`;
