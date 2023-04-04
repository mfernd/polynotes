import { css } from '@emotion/react';
import { FieldValues, RegisterOptions, UseFormRegister } from 'react-hook-form';

type InputCheckboxProps = {
  labelTitle: string;
  tabIndex?: number;
  registerHandle: UseFormRegister<FieldValues>;
  registerParams: {
    name: string;
    options?: RegisterOptions;
  };
};

export const InputCheckbox = (props: InputCheckboxProps) => {
  return (
    <label css={labelCss}>
      <div css={checkboxCss}>
        <input type="checkbox"
               tabIndex={props.tabIndex}
               {...props.registerHandle(props.registerParams.name, props.registerParams.options)}/>
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
  gap: 1rem;
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
      top: 10%;
      left: 35%;
      height: 0.9rem;
      width: 0.5rem;
      border: solid #fff;
      border-width: 0 0.15rem 0.15rem 0;
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