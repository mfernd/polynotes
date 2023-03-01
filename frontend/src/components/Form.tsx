import { FormEventHandler, ReactNode } from 'react';
import { css } from '@emotion/react';

type FormProps = {
  children: ReactNode;
  onSubmit: FormEventHandler<HTMLFormElement>;
};

export const Form = ({ children, onSubmit }: FormProps) => {
  return (
    <form css={formLoginCss}
          onSubmit={(e) => {
            onSubmit(e);
            e.preventDefault();
          }}>
      {children}
    </form>
  );
};

const formLoginCss = css`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  label {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 1rem;

    span {
      margin-bottom: 0.25rem;
    }
  }

  label:last-child {
    margin-bottom: unset;
  }
`;
