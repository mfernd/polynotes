import { MouseEventHandler, ReactNode } from 'react';
import { css, SerializedStyles } from '@emotion/react';

type ButtonProps = {
  children?: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  isSubmit?: boolean;
  customCss?: SerializedStyles;
};

export const Button = ({ children = 'NONE', onClick, isSubmit }: ButtonProps) => {
  const btn = buttonCss('#fff', '#fe0096', '#e40087',5, 3);

  return (
    <button type={isSubmit ? 'submit': undefined} onClick={onClick} css={btn}>
      {children}
    </button>
  );
};

const buttonCss = (
  color: string,
  bgColor: string,
  hoverBgColor: string,
  initHeight: number,
  addHeight: number,
) => css`
  width: 100%;
  cursor: pointer;
  text-decoration: none;
  padding: 10px 30px;

  background-color: ${bgColor};
  color: ${color};
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: 1px;

  border: 2px solid ${hoverBgColor};
  border-radius: 1rem;
  box-shadow: 0 ${initHeight}px ${hoverBgColor};
  transition: background-color 150ms linear, transform 150ms ease, box-shadow 150ms ease;

  &:hover {
    transform: translateY(-${addHeight}px);
    box-shadow: 0 ${initHeight + addHeight}px ${hoverBgColor};
  }

  &:active {
    background-color: ${hoverBgColor};
    transform: translateY(0);
    box-shadow: 0 ${initHeight}px #e40087;
  }
`;