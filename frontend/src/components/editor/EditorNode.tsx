import { KeyboardEvent, useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { css } from '@emotion/react';
import { addBottomNode, changeNodeType, deleteNode, onArrow, updateData } from '@/features/editorSlice';
import { Command, Node } from '@/typings/editor.type';
import { Editor } from '@tiptap/react';
import { DragHandle } from '@components/editor/DragHandle';
import { CommandManager } from '@components/editor/commands/CommandManager';
import { commands } from '@assets/json/commands.json';
import { getEditorNodeFromType } from '@/utils/getEditorNodeFromType';

type EditorNodeProps = {
  block: Node;
  isLastNode?: boolean;
};

type CommandManagerState = {
  show: boolean;
  commands: Command[];
  selectedCommand: number;
};

export const EditorNode = (props: EditorNodeProps) => {
  const dispatch = useDispatch();
  const [focused, setFocused] = useState(false);
  const [commandManager, setCommandManager] = useState({
    show: false,
    commands: commands as Command[],
    selectedCommand: 0,
  } as CommandManagerState);

  const beforeInput = useCallback((e: KeyboardEvent<HTMLDivElement>, editor: Editor | null) => {
    if (e.shiftKey) return;
    if (null === editor) return;
    const selection = window.getSelection();

    if (e.key === 'Enter' && !commandManager.show) {
      e.preventDefault();
      dispatch(addBottomNode(props.block.id));
    } else if (['Backspace', 'Delete'].includes(e.key) && editor.isEmpty) {
      e.preventDefault();
      dispatch(deleteNode(props.block.id));
    } else if (e.key === 'ArrowUp' && selection?.isCollapsed && !commandManager.show) {
      e.preventDefault();
      dispatch(onArrow({ orientation: 'up', cursorIndex: selection.anchorOffset }));
    } else if (e.key === 'ArrowDown' && selection?.isCollapsed && !commandManager.show) {
      e.preventDefault();
      dispatch(onArrow({ orientation: 'down', cursorIndex: selection.anchorOffset }));
    } else if (e.key === 'ArrowLeft' && selection?.isCollapsed && selection?.anchorOffset === 0) {
      dispatch(onArrow({ orientation: 'up', cursorIndex: 'end' }));
    } else if (e.key === 'ArrowRight' && selection?.isCollapsed && selection?.anchorOffset === editor.getText().length) {
      dispatch(onArrow({ orientation: 'down', cursorIndex: 'start' }));
    } else {
      dispatch(updateData(editor.getHTML()));
    }
  }, [commandManager]);

  const afterInput = useCallback((e: KeyboardEvent<HTMLDivElement>, editor: Editor | null) => {
    // Show/hide command manager
    if (e.key === '/') {
      setCommandManager({ ...commandManager, show: !commandManager.show });
      return;
    }

    if (!commandManager.show) return;
    // Filter commands
    const textContent = (e.target as HTMLDivElement).textContent;
    if (null === textContent) return;
    const query = textContent.substring(textContent.indexOf('/') + 1).split(' ')[0];
    const commandsFiltered = commands.filter((command) => command.title.toLowerCase().startsWith(query.toLowerCase())) as Command[];
    if (commandsFiltered.length === 0) {
      setCommandManager({ ...commandManager, commands: [] });
      setTimeout(() => {
        setCommandManager({ ...commandManager, show: false });
      }, 500);
    } else {
      setCommandManager({ ...commandManager, commands: commandsFiltered });
    }

    // Move selected command
    if (commandManager.commands.length === 0) return;
    if (e.key === 'ArrowUp') {
      const newSelectedCommand = commandManager.selectedCommand > 0 ? commandManager.selectedCommand - 1 : 0;
      setCommandManager({ ...commandManager, selectedCommand: newSelectedCommand });
    }
    if (e.key === 'ArrowDown') {
      const commandsLength = commandManager.commands.length;
      const newSelectedCommand = commandManager.selectedCommand < commandsLength - 1 ? commandManager.selectedCommand + 1 : commandsLength - 1;
      setCommandManager({ ...commandManager, selectedCommand: newSelectedCommand });
    }
    if (e.key === 'Enter') {
      const newType = commandManager.commands[commandManager.selectedCommand].blockName;
      dispatch(changeNodeType({ nodeId: props.block.id, newType }));
      setCommandManager({ ...commandManager, show: false });
    }
  }, [commandManager]);

  return (
    <div data-node-id={props.block.id}
         css={nodeContainerCss}
         onFocus={() => setFocused(true)}
         onBlur={() => setFocused(false)}
         onMouseEnter={() => setFocused(true)}
         onMouseLeave={() => setFocused(false)}>
      {/* Node */}
      {getEditorNodeFromType(props.block, props.isLastNode, beforeInput, afterInput)}
      {/* ---- */}
      <DragHandle nodeId={props.block.id} show={focused}/>
      {commandManager.show
        ? <CommandManager nodeId={props.block.id}
                          commands={commandManager.commands}
                          selected={commandManager.selectedCommand}
        onCommandClick={(blockName) => {
          dispatch(changeNodeType({ nodeId: props.block.id, newType: blockName }));
          setCommandManager({...commandManager, show: false});
        }}/>
        : null}
    </div>
  );
};

const nodeContainerCss = css`
  position: relative;
  background-color: rgba(0 0 0 / 2%);
  border-bottom: 1px solid #505050;
  border-radius: .5rem;

  .ProseMirror {
    padding: 3px 7px;

    &:focus {
      outline: none;
    }
  }
`;
