import { css } from '@emotion/react';
import { useEffect, useRef } from 'react';

type CommandBlockProps = {
  img?: string;
  title: string;
  info: string;
  isSelected?: boolean;
  onClick?: () => void;
};

export const CommandBlock = (props: CommandBlockProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (props.isSelected) {
      ref.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [props.isSelected]);

  return (
    <div ref={ref} onClick={props.onClick}
         css={css`
           ${commandCss};
           ${props.isSelected ? commandSelectedCss : undefined};
         `}>
      <div css={leftColumnCss}>
        {props.img ? <img src={props.img} alt={`${props.title} image preview`}/> : null}
      </div>
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
  height: 50px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  border-radius: 3px;
  padding: 5px 10px;

  :hover {
    background: rgba(55, 53, 47, 0.06);
  }

  :active {
    background: rgba(55, 53, 47, 0.1);
  }
`;

const commandSelectedCss = css`
  background: rgba(55, 53, 47, 0.1);
`;

const leftColumnCss = css`
  height: 100%;
  width: auto;
  aspect-ratio: 1;
  border-radius: 3px;
  background-color: #fff;
  box-shadow: rgba(15, 15, 15, 0.1) 0 0 0 1px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    aspect-ratio: 1;
    padding: 10px;
  }
`;

const textOverflow = css`
  overflow-x: clip;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const rightColumnCss = css`
  ${textOverflow};
  flex: 1 1 auto;
`;

const infoCss = css`
  ${textOverflow};
  color: rgba(55, 53, 47, 0.65);
  margin-top: 2px;
  font-size: 12px;
`;
