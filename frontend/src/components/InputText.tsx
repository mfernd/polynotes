import { css } from '@emotion/react';
import { ChangeEventHandler } from 'react';

type InputTextProps = {
  type: string;
  labelTitle: string;
  value: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  autoComplete?: string;
  placeholder?: string;
  tabIndex?: number;
};

export const InputText = (props: InputTextProps) => {
  return (
    <label css={labelCss}>
      <span>{props.labelTitle}</span>
      <input type={props.type}
             value={props.value}
             onChange={props.onChange}
             autoComplete={props.autoComplete}
             placeholder={props.placeholder}
             tabIndex={props.tabIndex}
             spellCheck={'false'}
             css={inputCss}/>
    </label>
  );
};

const labelCss = css`
  display: flex;
  flex-direction: column;
`;


const inputCss = css`
  width: 100%;
  padding: 1rem 1rem 0.8rem;
  box-sizing: border-box;

  background-color: #eee;
  color: #fe0096;
  font-size: 1.1rem;
  font-weight: 600;

  border: none;
  border-radius: 1rem;
  box-shadow: 0 3px #d8d8d8;

  &:focus {
    outline-color: #fe0096;
  }
`;
