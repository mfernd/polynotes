import { ReactNode } from 'react';
import { css } from '@emotion/react';

type CardProps = {
  children?: ReactNode;
  title?: string;
};

export const Card = ({ children, title }: CardProps) => {
  return (
    <article css={cardCss}>
      {title && <h1 css={cardTitleCss}>{title}</h1>}
      {children}
    </article>
  );
};

const cardCss = css`
  cursor: default;
  padding: 1.25rem 2rem;

  background-color: #fafbfb;
  border: 1px solid #d8d8d8;
  border-radius: 1rem;
  box-shadow: 0 3px #d8d8d8;
  text-align: justify;
`;

const cardTitleCss = css`
  margin: 0 0 0.75rem;
`;