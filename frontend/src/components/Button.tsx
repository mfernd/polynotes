import { MouseEventHandler, ReactNode } from 'react';
import { css } from '@emotion/react';

type ButtonProps = {
  children?: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

export const Button = ({ children = 'NONE', onClick }: ButtonProps) => {
  return (
    <button onClick={onClick} css={buttonCss(5, 2)}>
      {children}
    </button>
  );
};

const buttonCss = (initHeight: number, addHeight: number) => css`
  cursor: pointer;
  text-decoration: none;
  padding: 10px 30px;

  background-color: #fe0096;
  color: #fff;
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: 1px;

  border: 1px solid #e40087;
  border-radius: 4px;
  box-shadow: 0 ${initHeight}px 0 #e40087;
  transition: background-color 150ms linear, transform 150ms ease, box-shadow 150ms ease;

  &:hover {
    transform: translateY(-${addHeight}px);
    box-shadow: 0 ${initHeight + addHeight}px 0 #e40087;
  }

  &:active {
    background-color: #e40087;
    transform: translateY(0);
    box-shadow: 0 ${initHeight}px 0 #e40087;
  }
`;