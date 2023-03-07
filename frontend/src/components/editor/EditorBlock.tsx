import { DragHandle } from '@components/editor/DragHandle';
import { css } from '@emotion/react';
import { KeyboardEvent, MouseEvent, useCallback } from 'react';
import { BlockData } from '@/typings/editor.type';

type EditorBlockProps = BlockData & {
  placeholder?: string;
  addBlock?: (event?: MouseEvent<HTMLDivElement>) => void;
  removeBlock?: (blockId: string) => void;
};

export const EditorBlock = (props: EditorBlockProps) => {
  const kbdListener = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
    if (props.addBlock && e.key === 'Enter') {
      e.preventDefault();
      props.addBlock();
    }

    if (props.removeBlock && e.key === 'Backspace') {
      e.preventDefault();
      props.removeBlock(props.blockId);
    }
  }, []);

  return (
    <div data-block-id={props.blockId}
         css={blockContainerCss}>
      <div contentEditable
           placeholder={props.placeholder}
           onKeyDown={kbdListener}
           css={blockCss}></div>
      <DragHandle onPlusClick={props.addBlock}/>
    </div>
  );
};

const blockContainerCss = css`
  position: relative;

  &:hover .drag-handle, div:focus + .drag-handle {
    transition: opacity 50ms ease-in;
    visibility: visible;
    opacity: 1;
  }
`;

const blockCss = css`
  padding: 3px 7px;

  &:empty:after {
    content: attr(placeholder);
    color: rgba(55, 53, 47, 0.5);
    font-size: 16px;
  }

  &:focus {
    outline: none;
  }
`;
