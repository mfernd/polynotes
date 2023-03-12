import { css } from '@emotion/react';
import { useDispatch } from 'react-redux';
import { CommandBlock } from '@components/editor/commands/CommandBlock';
import { commands } from '@assets/json/commands.json';

type CommandManagerProps = {
  nodeId: string;
  query: string;
  show?: boolean;
};

export const CommandManager = (props: CommandManagerProps) => {
  if (!props.show) return null;

  const dispatch = useDispatch();
  const baseCommands = commands.filter((c) => c.type === 'base');
  const mediaCommands = commands.filter((c) => c.type === 'media');

  return (
    <div css={commandBlockCss(50)}>
      <div css={css`overflow-y: scroll;`}>
        <div css={commandTypeCss}>
          <div css={headingCss}>Blocs de base</div>
          <div css={commandsCss}>
            {baseCommands.map((command, index) => (
              <CommandBlock key={index} img={command.img} title={command.title} info={command.info} isSelected={index === 0}/>
            ))}
          </div>
        </div>

        <div css={commandTypeCss}>
          <div css={headingCss}>Média</div>
          <div css={commandsCss}>
            {mediaCommands.map((command, index) => (
              <CommandBlock key={index} img={command.img} title={command.title} info={command.info} isSelected={false}/>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const commandBlockCss = (x: number) => css`
  z-index: 1;
  position: absolute;
  top: calc(100% + 5px);
  left: ${x}px;

  display: flex;
  flex-direction: column;
  width: 330px;
  height: 400px;
  overflow: hidden;

  background-color: white;
  border-radius: 3px;
  box-shadow: 0 0 0 1px rgba(15, 15, 15, 0.05), 0 3px 6px rgba(15, 15, 15, 0.1), 0 5px 20px rgba(15, 15, 15, 0.1);

  & > div > :not(:first-of-type) {
    border-top: 1px solid rgba(55, 53, 47, 0.1);
  }
`;

const commandTypeCss = css`
  padding: 12px;
`;

const headingCss = css`
  user-select: none;
  color: rgba(55, 53, 47, 0.65);
  font-size: 12px;
  font-weight: 500;
  padding: 0 14px 8px;
`;

const commandsCss = css`
  display: flex;
  flex-direction: column;
`;
