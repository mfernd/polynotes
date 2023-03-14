import { css } from '@emotion/react';
import { CommandBlock } from '@components/editor/commands/CommandBlock';
import { Command, NodeType } from '@/typings/editor.type';

type CommandManagerProps = {
  nodeId: string;
  commands: Command[];
  selected: number;
  onCommandClick?: (blockName: NodeType) => void;
};

export const CommandManager = (props: CommandManagerProps) => {
  const baseCommands = props.commands.filter((c) => c.type === 'base');
  const mediaCommands = props.commands.filter((c) => c.type === 'media');

  const baseCommandsRender = (
    <div css={commandTypeCss}>
      <div css={headingCss}>Blocs de base</div>
      <div css={commandsCss}>
        {baseCommands.map((command, index) => (
          <CommandBlock key={index} img={command.img}
                        title={command.title}
                        info={command.info}
                        isSelected={index === props.selected}
                        onClick={() => props.onCommandClick && props.onCommandClick(command.blockName)}/>
        ))}
      </div>
    </div>
  );
  const mediaCommandsRender = (
    <div css={commandTypeCss}>
      <div css={headingCss}>Média</div>
      <div css={commandsCss}>
        {mediaCommands.map((command, index) => (
          <CommandBlock key={index} img={command.img}
                        title={command.title}
                        info={command.info}
                        isSelected={index === props.selected - baseCommands.length}
                        onClick={() => props.onCommandClick && props.onCommandClick(command.blockName)}/>
        ))}
      </div>
    </div>
  );

  return (
    <div css={commandBlockCss(20)}>
      <div>
        {props.commands.length === 0
          ? (
            <div css={commandTypeCss}>
              <div css={textHeaderCss}>Pas de résultats...</div>
            </div>)
          : null}
        {baseCommands.length > 0 ? baseCommandsRender : null}
        {mediaCommands.length > 0 ? mediaCommandsRender : null}
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
  min-height: min-content;
  max-height: 400px;
  overflow: hidden;

  background-color: white;
  border-radius: 3px;
  box-shadow: 0 0 0 1px rgba(15, 15, 15, 0.05), 0 3px 6px rgba(15, 15, 15, 0.1), 0 5px 20px rgba(15, 15, 15, 0.1);

  & > div {
    overflow-y: auto;
    flex-grow: 1;

    & > :not(:first-of-type) {
      border-top: 1px solid rgba(55, 53, 47, 0.1);
    }
  }
`;

const commandTypeCss = css`
  padding: 12px;
`;

const textHeaderCss = css`
  user-select: none;
  color: rgba(55, 53, 47, 0.65);
  font-size: 12px;
  font-weight: 500;
`;

const headingCss = css`
  ${textHeaderCss};
  padding: 0 10px 4px;
`;

const commandsCss = css`
  display: flex;
  flex-direction: column;
`;
