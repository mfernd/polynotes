import { css } from '@emotion/react';
import { NavLink } from 'react-router-dom';

type TileProps = {
  title: string;
  imageUrl?: string;
  updatedAt: Date;
  link?: string;
};

export const Tile = (props: TileProps) => {
  const dateFormat = new Intl.DateTimeFormat('fr', { dateStyle: 'medium', timeStyle: 'medium' });

  const tileBody = (
    <>
      <div css={previewSectionCss}>
        <div css={imgContainerCss}>
          {props.imageUrl
            ? <img src={props.imageUrl} alt={`"${props.title}" tile image`}/>
            : (
              <div>
                <strong>{props.title}</strong>
                <small>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit. A accusantium adipisci amet assumenda corporis, doloremque dolores eos
                  est et harum hic illo illum inventore iste!
                </small>
              </div>)}
        </div>
      </div>
      <div css={detailsSectionCss} className={'tile-description'}>
        <h1>{props.title}</h1>
        <p>{`Modifié le ${dateFormat.format(props.updatedAt)}`}</p>
      </div>
    </>
  );

  return (
    <div css={tileCss} title={props.title}>
      {props.link
        ? <NavLink to={props.link}>{tileBody}</NavLink>
        : tileBody}
    </div>
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

  &:hover .tile-description {
    background-color: #fafafa;
    transition: background-color 250ms ease;
  }
`;

const previewSectionCss = css`
  border-top-left-radius: inherit;
  border-top-right-radius: inherit;

  height: 120px;
  background-color: #f5f5f5;
  overflow: hidden;
  padding: 6% 6% 0;
`;

const imgContainerCss = css`
  box-shadow: 0 0 4px 0 rgba(0 0 0 / 20%);
  height: 100%;
  width: 100%;
  background-color: #fafafa;

  & > img {
    margin: 0;
    height: 100%;
    width: 100%;
    object-fit: cover;
  }

  & > div {
    padding: 15px 20px 0;
    font-size: 0.75rem;
    font-weight: normal;
    text-align: justify;
    display: flex;
    flex-direction: column;
    gap: 5px;

    strong {
      font-size: 1rem;
    }
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