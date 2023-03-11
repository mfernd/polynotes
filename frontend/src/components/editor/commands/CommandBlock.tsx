import { css } from '@emotion/react';

type CommandBlockProps = {
  img: string;
  title: string;
  info: string;
};

export const CommandBlock = (props: CommandBlockProps) => {
  return (
    <div css={commandCss}>
      <img src={props.img} alt={`${props.title} image preview`} css={leftColumnCss}/>
      <div css={rightColumnCss}>
        <div css={textOverflow}>{props.title}</div>
        <div css={infoCss} title={props.info}>{props.info}</div>
      </div>
    </div>
  );
};

const commandCss = css`
  user-select: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  height: 60px;
  font-size: 14px;
`;

const leftColumnCss = css`
  height: 100%;
  width: auto;
  object-fit: cover;
  aspect-ratio: 1;
  border-radius: 3px;
  background-color: #fff;
  box-shadow: rgba(15, 15, 15, 0.1) 0 0 0 1px;
`;

const textOverflow = css`
  overflow-x: clip;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const rightColumnCss = css`
  ${textOverflow};
  flex: 1 1 auto;
  margin-right: 1rem;
`;

const infoCss = css`
  ${textOverflow};
  color: rgba(55, 53, 47, 0.65);
  margin-top: 2px;
  font-size: 12px;
`;
