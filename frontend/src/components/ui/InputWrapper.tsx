import { css } from '@emotion/react';
import { ReactNode } from 'react';

type InputWrapper = {
  labelTitle?: string;
  children: ReactNode;
};

export const InputWrapper = (props: InputWrapper) => {
  return (
    <label css={labelCss}>
      {props.labelTitle ? <span>{props.labelTitle}</span> : null}
      {props.children}
    </label>
  );
};

const labelCss = css`
  width: 100%;
  display: flex;
  flex-direction: column;
`;
