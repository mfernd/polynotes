import { MouseEventHandler, ReactNode } from 'react';
import { css, SerializedStyles } from '@emotion/react';

type ButtonProps = {
  children?: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  isSubmit?: boolean;
  customCss?: SerializedStyles;
  buttonProperties?: ButtonProperties;
};

type ButtonProperties = {
  color?: string;
  bgColor?: string;
  hoverBgColor?: string;
  initHeight?: number;
  addHeight?: number;
  padding?: string;
  isFullWidth?: boolean;
};

export const Button = (props: ButtonProps) => {
  const btnCss = buttonCss({ ...props.buttonProperties });

  return (
    <button type={props.isSubmit ? 'submit' : undefined}
            onClick={props.onClick}
            css={css`
              ${props.customCss};
              ${btnCss};`}>
      {props.children}
    </button>
  );
};

const buttonCss = (
  {
    color = '#fff',
    bgColor = '#fe0096',
    hoverBgColor = '#e40087',
    initHeight = 5,
    addHeight = 3,
    padding = '10px 30px',
    isFullWidth = true,
  }: ButtonProperties,
) => css`
  ${isFullWidth ? 'width: 100%;' : ''}
  display: flex;
  gap: 5px;
  cursor: pointer;
  text-decoration: none;
  padding: ${padding};

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