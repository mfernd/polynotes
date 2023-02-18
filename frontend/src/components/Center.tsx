import { ReactNode } from 'react';
import { css } from '@emotion/react';

type CenterProps = {
  children: ReactNode;
};

export const Center = ({ children }: CenterProps) => {
  return (
    <div css={css`
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    `}>
      {children}
    </div>
  );
};