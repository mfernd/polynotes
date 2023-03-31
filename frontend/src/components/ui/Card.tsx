import { ReactNode } from 'react';
import { css, SerializedStyles } from '@emotion/react';
import logo from '@assets/images/logo.png';
import { NavLink } from 'react-router-dom';

type CardProps = {
  children?: ReactNode;
  title?: string;
  showLogo?: boolean;
  cardContentCss?: SerializedStyles;
};

export const Card = (props: CardProps) => {
  return (
    <div css={css`position: relative;`}>
      {props.showLogo
        ? (
          <NavLink to={'/'} css={logoCss} title={"Revenir à l'accueil"}>
            <img src={logo} alt={'revenir à l\'accueil'}/>
          </NavLink>)
        : null}
      <article css={cardCss}>
        {props.title && <h1 css={cardTitleCss}>{props.title}</h1>}
        <div css={props.cardContentCss}>
          {props.children}
        </div>
      </article>
    </div>
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
  position: absolute;
  top: -160px;
  left: -120px;
  transform: rotate(-20deg);
  filter: drop-shadow(0 2px 0 rgb(0 0 0 / 0.1)) drop-shadow(2px 2px 0 rgb(0 0 0 / 0.1));

  height: auto;
  width: 225px;
  aspect-ratio: 1;

  :hover {
    transition: transform 100ms ease-in-out;
    transform: rotate(-20deg) scale(1.1);
  }
`;

const cardTitleCss = css`
  margin: 0 0 0.75rem;
`;