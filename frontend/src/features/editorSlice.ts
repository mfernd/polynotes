import { ulid } from 'ulid';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NodeData } from '@/typings/editor.type';

export type NodeState = {
  focusIndex: number;
  nodes: NodeData[];
};

const initialState: NodeState = {
  focusIndex: 0,
  nodes: [
    { id: ulid(), type: 'text' },
  ],
};

export const editorSlice = createSlice({
  name: 'editorNode',
  initialState,
  reducers: {
    changeFocus: (state, nodeId: PayloadAction<string>) => {
      state.focusIndex = state.nodes.findIndex((node) => node.id === nodeId.payload);
    },
    addBottomNode: (state, nodeId: PayloadAction<string>) => {
      const nodeIndex = state.nodes.findIndex((node) => node.id === nodeId.payload);
      if (nodeIndex === -1) return state;

      state.focusIndex = nodeIndex + 1;
      state.nodes.push({ id: ulid(), type: 'text' });
    },
  },
});

export const { changeFocus, addBottomNode } = editorSlice.actions;
export default editorSlice.reducer;
