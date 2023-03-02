import { ReactNode } from 'react';
import { css } from '@emotion/react';

type CenterProps = {
  isVertical?: boolean;
  children: ReactNode;
};

export const Center = ({ isVertical, children }: CenterProps) => {
  return (
    <div css={css`
      min-height: 100vh;
      display: flex;
      flex-direction: ${isVertical ? 'column' : 'row'};
      align-items: center;
      justify-content: center;
    `}>
      {children}
    </div>
  );
};