import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Node, NodeType } from '@/typings/editor.type';
import { v4 as uuidv4 } from 'uuid';

export type NodeState = {
  focusedNode: string;
  cursorIndex: number | 'start' | 'end';
  nodes: Node[];
};

const firstUuid = uuidv4();
const initialState: NodeState = {
  focusedNode: firstUuid,
  cursorIndex: 0,
  nodes: [
    { uuid: firstUuid, type: 'header-1', data: '', settingsOpen: false },
    { uuid: uuidv4(), type: 'header-2', data: '', settingsOpen: false },
    { uuid: uuidv4(), type: 'header-3', data: '', settingsOpen: false },
    { uuid: uuidv4(), type: 'text', data: '', settingsOpen: false },
    { uuid: uuidv4(), type: 'text', data: '', settingsOpen: false },
  ],
};

export const editorSlice = createSlice({
  name: 'editorNode',
  initialState,
  reducers: {
    initEditor: (state, initState: PayloadAction<NodeState>) => {
      state.focusedNode = initState.payload.focusedNode;
      state.cursorIndex = initState.payload.cursorIndex;
      state.nodes = initState.payload.nodes;
    },
    updateFocus: (state, nodeId: PayloadAction<string>) => {
      state.focusedNode = nodeId.payload;
    },
    updateData: (state, action: PayloadAction<{ nodeId: string, newData: string }>) => {
      const index = state.nodes.findIndex((node) => node.uuid === action.payload.nodeId);
      if (index === -1) return;

      state.nodes[index].data = action.payload.newData;
    },
    switchSettings: (state, action: PayloadAction<{ nodeId: string, isOpen: boolean }>) => {
      const index = state.nodes.findIndex((node) => node.uuid === action.payload.nodeId);
      if (index === -1) return;

      state.nodes[index].settingsOpen = action.payload.isOpen;
    },
    onArrow: (state, action: PayloadAction<{ nodeId: string, orientation: 'up' | 'down', cursorIndex?: number | 'start' | 'end' }>) => {
      const index = state.nodes.findIndex((node) => node.uuid === action.payload.nodeId);
      if (index === -1) return;

      if (action.payload.orientation === 'up' && index > 0)
        state.focusedNode = state.nodes[index - 1].uuid;
      if (action.payload.orientation === 'down' && index < state.nodes.length - 1)
        state.focusedNode = state.nodes[index + 1].uuid;

      if (undefined !== action.payload.cursorIndex)
        state.cursorIndex = action.payload.cursorIndex;
    },
    addBottomNode: (state, nodeId: PayloadAction<string>) => {
      const index = state.nodes.findIndex((node) => node.uuid === nodeId.payload);
      if (index === -1) return;

      const uuid = uuidv4();
      state.focusedNode = uuid;
      let nextNode: Node = { uuid, type: 'text', data: '', settingsOpen: false };
      switch (state.nodes[index].type) {
        case 'bulleted-list':
          nextNode = { uuid, type: 'bulleted-list', data: '', settingsOpen: false };
          break;
        case 'numbered-list':
          nextNode = { uuid, type: 'numbered-list', data: '', settingsOpen: false };
          break;
      }
      state.nodes.splice(index + 1, 0, nextNode);
    },
    deleteNode: (state, nodeId: PayloadAction<string>) => {
      if (state.nodes.length === 1) return;
      const index = state.nodes.findIndex((node) => node.uuid === nodeId.payload);
      if (index === -1) return;

      if (index === 0)
        state.focusedNode = state.nodes[index + 1].uuid;
      else
        state.focusedNode = state.nodes[index - 1].uuid;
      state.nodes.splice(index, 1);
    },
    changeNodeType: (state, action: PayloadAction<{ nodeId: string; newType: NodeType }>) => {
      const index = state.nodes.findIndex((node) => node.uuid === action.payload.nodeId);
      if (index === -1) return;

      if ('image' === action.payload.newType) {
        state.nodes[index].data = '';
        state.nodes[index].settingsOpen = true;
      }
      state.nodes[index].type = action.payload.newType;
    },
  },
});

export const { initEditor, updateFocus, updateData, switchSettings, onArrow, addBottomNode, deleteNode, changeNodeType } = editorSlice.actions;
export default editorSlice.reducer;
