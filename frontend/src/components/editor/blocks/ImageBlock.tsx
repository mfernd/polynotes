import { DefaultBlockProps } from '@/typings/editor.type';
import { css } from '@emotion/react';
import { useDispatch } from 'react-redux';
import { KeyboardEventHandler, useCallback, useState } from 'react';
import { switchSettings, updateData } from '@/features/editorSlice';

export const ImageBlock = (props: DefaultBlockProps) => {
  const dispatch = useDispatch();

  const [imgState, setImageState] = useState<string>(props.node.data);

  const onKeyDown: KeyboardEventHandler<HTMLInputElement> = useCallback((e) => {
    if ('Enter' === e.key) onButtonClick();
  }, [imgState]);

  const onButtonClick = useCallback(() => {
    if (imgState !== props.node.data)
      dispatch(updateData({ nodeId: props.node.uuid, newData: imgState }));
    dispatch(switchSettings({nodeId: props.node.uuid, isOpen: false}));
  }, [imgState]);

  return (
    <div css={imageBlockCss}>
      {props.node.settingsOpen
        ? (
          <div css={imageFormCss}>
            <input type={'text'}
                   placeholder={'https://placekitten.com/480/360'}
                   value={imgState}
                   onChange={(e) => setImageState(e.target.value)}
                   onKeyDown={onKeyDown}/>
            <button onClick={onButtonClick}>Valider</button>
          </div>)
        : <img src={props.node.data}
               alt={`image of block ${props.node.uuid}`}
               onClick={() => dispatch(switchSettings({nodeId: props.node.uuid, isOpen: true}))}/>}
    </div>
  );
};

const imageBlockCss = css`
  width: 100%;
  border-radius: 1rem;
  margin: 15px 0;
  cursor: default;
  
  img {
    display: block;
    cursor: pointer;
    border-radius: 5px;
  }
`;

const imageFormCss = css`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: start;
  gap: 10px;
  margin-bottom: 1rem;

  input, button {
    padding: 5px 10px;
    background-color: transparent;
    border: 1px solid rgba(0 0 0 / 10%);
    border-radius: 0.25rem;
    outline: none;
  }

  input {
    max-width: 500px;
    flex: 1;
  }

  button {
    cursor: pointer;
    
    &:hover {
      background-color: rgba(0 0 0 / 5%);
    }
    
    &:active {
      background-color: rgba(0 0 0 / 10%);
    }
  }
`;
