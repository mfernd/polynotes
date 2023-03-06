import { css } from '@emotion/react';
import { NavLink } from 'react-router-dom';

type TileProps = {
  imageUrl: string;
  title: string;
  modifiedDate: Date;
  link?: string;
};

export const Tile = (props: TileProps) => {
  const tileBody = (
    <>
      <div css={previewSectionCss}>
        <img src={props.imageUrl}
             alt={`"${props.title}" tile image`}/>
      </div>
      <div css={detailsSectionCss}>
        <h1>{props.title}</h1>
        <p>Modifié le{` ${props.modifiedDate.toLocaleDateString('fr', { dateStyle: 'medium' })}`}</p>
      </div>
    </>
  );

  return (
    <>
      {props.link ?
        <div css={tileCss} title={props.title}>
          <NavLink to={props.link}>{tileBody}</NavLink>
        </div>
        : <div css={tileCss} title={props.title}>{tileBody}</div>}
    </>
  );
};

const tileCss = css`
  cursor: pointer;
  min-width: 250px;
  max-width: 250px;

  border: 1px solid #dadce0;
  border-radius: 6px;
  
  a {
    border-radius: inherit;
    text-decoration: none;
    color: unset;
  }
`;

const previewSectionCss = css`
  border-top-left-radius: inherit;
  border-top-right-radius: inherit;

  height: 120px;
  background-color: #f5f5f5;
  overflow: hidden;
  padding: 6% 6% 0;

  img {
    box-shadow: 0 0 4px 0 rgba(0 0 0 / 20%);
    margin: 0;
    height: 100%;
    width: 100%;
    object-fit: cover;
  }
`;

const detailsSectionCss = css`
  border-bottom-left-radius: inherit;
  border-bottom-right-radius: inherit;

  height: 70px;
  background-color: #fff;
  border-top: 1px solid rgb(218, 220, 224);
  padding: 12px 15px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  h1 {
    margin: 0;
    color: rgb(60, 64, 67);
    font-size: 13px;
    font-weight: 500;
    overflow: clip;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  p {
    margin: 0;
    color: rgba(25, 23, 17, 0.6);
    font-size: 12px;
    font-weight: 700;
  }
`;