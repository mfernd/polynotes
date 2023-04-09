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
    { uuid: firstUuid, type: 'header-1', data: '' },
    { uuid: uuidv4(), type: 'header-2', data: '' },
    { uuid: uuidv4(), type: 'header-3', data: '' },
    { uuid: uuidv4(), type: 'text', data: '' },
    { uuid: uuidv4(), type: 'text', data: '' },
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
    updateData: (state, newData: PayloadAction<string>) => {
      const index = state.nodes.findIndex((node) => node.uuid === state.focusedNode);
      if (index === -1) return;

      state.nodes[index].data = newData.payload;
    },
    onArrow: (state, action: PayloadAction<{ orientation: 'up' | 'down', cursorIndex?: number | 'start' | 'end' }>) => {
      const index = state.nodes.findIndex((node) => node.uuid === state.focusedNode);
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
      switch (state.nodes[index].type) {
        default: // text by default for now
          state.nodes.splice(index + 1, 0, { uuid, type: 'text', data: '' });
      }
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

      state.nodes[index].type = action.payload.newType;
    },
  },
});

export const { initEditor, updateFocus, updateData, onArrow, addBottomNode, deleteNode, changeNodeType } = editorSlice.actions;
export default editorSlice.reducer;
