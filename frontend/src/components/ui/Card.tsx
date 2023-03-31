import { ReactNode } from 'react';
import { css, SerializedStyles } from '@emotion/react';
import logo from '@assets/images/logo.png';

type CardProps = {
  children?: ReactNode;
  title?: string;
  showLogo?: boolean;
  cardContentCss?: SerializedStyles;
};

export const Card = (props: CardProps) => {
  const buildedCss = css`
    ${cardCss};
    ${props.showLogo ? logoCss : ''};
  `;

  return (
    <article css={buildedCss}>
      {props.title && <h1 css={cardTitleCss}>{props.title}</h1>}
      <div css={props.cardContentCss}>
        {props.children}
      </div>
    </article>
  );
};

const cardCss = css`
  position: relative;
  padding: 1.25rem 2rem 2rem 2rem;

  background-color: #fafbfb;
  border: 1px solid #d8d8d8;
  border-radius: 1rem;
  box-shadow: 0 3px #d8d8d8;
  text-align: justify;
`;

const logoCss = css`
  &::before {
    content: "";
    position: absolute;
    top: -160px;
    left: -120px;
    transform: rotate(-20deg);

    height: auto;
    width: 225px;
    aspect-ratio: 1;

    background-image: url("${logo}");
    background-size: 100%;
    filter: drop-shadow(0 2px 0 rgb(0 0 0 / 0.1)) drop-shadow(2px 2px 0 rgb(0 0 0 / 0.1));
    z-index: -1;
  }
`;

const cardTitleCss = css`
  margin: 0 0 0.75rem;
`;