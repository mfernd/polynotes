import { ForwardedRef, forwardRef, KeyboardEvent } from 'react';
import { useDispatch } from 'react-redux';
import { css } from '@emotion/react';
import { changeFocus } from '@/features/editorSlice';

type TextBlockProps = {
  nodeId: string;
  isLastBlock?: boolean;
  kbdListener: (e: KeyboardEvent<HTMLDivElement>) => void;
};

export const TextBlock = forwardRef((props: TextBlockProps, ref: ForwardedRef<HTMLDivElement>) => {
  const dispatch = useDispatch();

  return (
    <div ref={ref}
         contentEditable
         placeholder={props.isLastBlock ? 'Appuyez sur / pour afficher les commandes…' : undefined}
         onFocus={() => dispatch(changeFocus(props.nodeId))}
         onKeyDown={props.kbdListener}
         css={nodeCss}></div>
  );
});

const nodeCss = css`
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