import { ForwardedRef, forwardRef, KeyboardEvent } from 'react';
import { useDispatch } from 'react-redux';
import { css } from '@emotion/react';
import { updateFocus } from '@/features/editorSlice';
import { NodeTextContent } from '@/typings/editor.type';

type TextBlockProps = {
  nodeId: string;
  data: NodeTextContent;
  placeholder?: string;
  kbdListener: (e: KeyboardEvent<HTMLDivElement>) => void;
};

export const TextBlock = forwardRef((props: TextBlockProps, ref: ForwardedRef<HTMLDivElement>) => {
  const dispatch = useDispatch();

  return (
    <div ref={ref}
         contentEditable
         placeholder={props.placeholder}
         onFocus={() => dispatch(updateFocus(props.nodeId))}
         onKeyDown={props.kbdListener}
         css={nodeCss}
         suppressContentEditableWarning>
      {props.data}
    </div>
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