import { ChangeEventHandler } from 'react';
import { css } from '@emotion/react';

type InputCheckboxProps = {
  labelTitle: string;
  value: boolean;
  onChange?: ChangeEventHandler<HTMLInputElement>;
};

export const InputCheckbox = (props: InputCheckboxProps) => {
  return (
    <label css={labelCss}>
      <div css={checkboxCss}>
        <input type="checkbox"
               checked={props.value}
               onChange={props.onChange}/>
        <span></span>
      </div>
      <span css={css`user-select: none;`}>{props.labelTitle}</span>
    </label>
  );
};

const labelCss = css`
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const checkboxCss = css`
  position: relative;

  input[type="checkbox"] {
    visibility: hidden;
  }

  & > span {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    height: 1.55rem;
    width: auto;
    aspect-ratio: 1;
    background: #606062;
    border-radius: 7px;
    box-shadow: 0 0 1px rgba(0, 0, 0, 0.30);

    &:after {
      content: "";
      display: none;
      position: absolute;
      top: 0.36rem;
      left: 0.535rem;
      height: 0.5rem;
      width: 0.25rem;
      border: solid #fff;
      border-width: 0 0.15em 0.15em 0;
      transform: rotate(45deg);
    }
  }

  & > input[type="checkbox"]:checked ~ span {
    background-color: #ff9bcf;

    &:after {
      display: block;
    }
  }
`;