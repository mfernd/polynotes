import { css } from '@emotion/react';
import { useDispatch } from 'react-redux';
import { CommandBlock } from '@components/editor/commands/CommandBlock';
import logo from '@assets/images/logo.png';

type CommandManagerProps = {
  nodeId: string;
  query: string;
  show?: boolean;
};

export const CommandManager = (props: CommandManagerProps) => {
  if (props.show) return null;

  const dispatch = useDispatch();

  return (
    <div css={commandBlockCss(50)}>
      <div css={headingCss}>Blocs</div>
      <div css={commandsCss}>
        <CommandBlock img={logo} title={'Texte'} info={'Écrivez du texte. Tout simplement.'}/>
        <CommandBlock img={logo} title={'Texte'} info={'Écrivez du texte. Tout simplement.'}/>
        <CommandBlock img={logo} title={'Texte'} info={'Écrivez du texte. Tout simplement.'}/>
        <CommandBlock img={logo} title={'Texte'} info={'Écrivez du texte. Tout simplement.'}/>
      </div>
    </div>
  );
};

const commandBlockCss = (x: number) => css`
  z-index: 10;
  position: absolute;
  top: calc(100% + 4px);
  left: ${x}px;

  display: flex;
  flex-direction: column;
  width: 330px;
  height: 400px;
  overflow-y: scroll;

  padding: 14px 0 14px 14px;
  background-color: white;
  border-radius: 4px;
  box-shadow: rgba(15, 15, 15, 0.05) 0 0 0 1px, rgba(15, 15, 15, 0.1) 0 3px 6px, rgba(15, 15, 15, 0.2) 0 9px 24px;
`;

const headingCss = css`
  user-select: none;
  color: rgba(55, 53, 47, 0.65);
  font-size: 12px;
  font-weight: 500;
  margin-bottom: 7px;
`;

const commandsCss = css`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
