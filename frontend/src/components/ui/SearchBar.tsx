import { css } from '@emotion/react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { InputWrapper } from '@components/ui/InputWrapper';

export const SearchBar = () => {
  const { register, handleSubmit } = useForm();
  const onSubmit: SubmitHandler<FieldValues> = (data) => console.log(data);

  return (
    <>
      <InputWrapper>
        <input css={searchBarCss}
               type={'search'}
               autoComplete={'on'}
               placeholder={'🔎 Search'}
               {...register('search', { onChange: handleSubmit(onSubmit) })}/>
      </InputWrapper>
    </>
  );
};

const searchBarCss = css`
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
