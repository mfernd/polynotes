import { useState } from 'react';
import { Command, NodeType } from '@/typings/editor.type';
import { commands } from '@assets/json/commands.json';
import { useDispatch } from 'react-redux';
import { changeNodeType } from '@/features/editorSlice';

type CommandManagerState = {
  show: boolean;
  commands: Command[];
  selectedIndex: number;
};

const initialState: CommandManagerState = {
  show: false,
  commands: commands as Command[],
  selectedIndex: 0,
};

export function useCommandManager() {
  const [state, setState] = useState(initialState);
  const dispatch = useDispatch();

  return {
    show: state.show,
    commands: state.commands,
    selectedIndex: state.selectedIndex,
    chooseCommand: (nodeId: string, newType?: NodeType) => {
      if (undefined === newType) {
        const newType = state.commands[state.selectedIndex].blockName;
        dispatch(changeNodeType({ nodeId, newType }));
      } else {
        dispatch(changeNodeType({ nodeId, newType }));
      }
      setState(initialState);
    },
    toggleCommands: (show?: boolean) => {
      if (undefined === show) {
        setState({ ...state, show: !state.show });
      } else {
        setState({ ...state, show });
      }
    },
    goUpOneCommand: () => {
      if (!state.show) return;
      const newSelectedCommand = state.selectedIndex > 0 ? state.selectedIndex - 1 : 0;
      setState({ ...state, selectedIndex: newSelectedCommand });
    },
    goDownOneCommand: () => {
      if (!state.show) return;
      const commandsLength = state.commands.length;
      const newSelectedCommand = state.selectedIndex < commandsLength - 1 ? state.selectedIndex + 1 : commandsLength - 1;
      setState({ ...state, selectedIndex: newSelectedCommand });
    },
    filterCommands: (textContent: string, timeout?: number) => {
      if (!state.show) return;

      const query = textContent.substring(textContent.indexOf('/') + 1).split(' ')[0];
      if (query === '') {
        setState({ ...state, commands: commands as Command[] });
        return;
      }

      const commandsFiltered = commands.filter((command) => command.title.toLowerCase().startsWith(query.toLowerCase())) as Command[];
      if (commandsFiltered.length > 0) {
        setState({ ...state, commands: commandsFiltered });
      } else {
        setTimeout(() => setState(initialState), timeout ?? 500);
      }
    },
  };
}