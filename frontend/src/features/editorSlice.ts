import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Node, NodeTextContent } from '@/typings/editor.type';
import { v4 as uuidv4 } from 'uuid';

export type NodeState = {
  focusIndex: number;
  nodes: Node[];
};

const initialState: NodeState = {
  focusIndex: 0,
  nodes: [
    { id: uuidv4(), type: 'text', data: '' },
  ],
};

export const editorSlice = createSlice({
  name: 'editorNode',
  initialState,
  reducers: {
    updateFocus: (state, nodeId: PayloadAction<string>) => {
      state.focusIndex = state.nodes.findIndex((node) => node.id === nodeId.payload);
    },
    onArrow: (state, isUp: PayloadAction<boolean>) => {
      if (isUp.payload && state.focusIndex > 0)
        state.focusIndex -= 1;
      if (!isUp.payload && state.focusIndex < state.nodes.length - 1)
        state.focusIndex += 1;
    },
    setData: (state, newData: PayloadAction<NodeTextContent>) => {
      state.nodes[state.focusIndex].data = newData.payload;
    },
    addBottomNode: (state) => {
      const index = state.focusIndex;
      state.nodes.splice(index + 1, 0, { id: uuidv4(), type: 'text', data: '' });
      state.focusIndex = index + 1;
    },
    deleteNode: (state) => {
      if (state.nodes.length === 1) return;
      const index = state.focusIndex;
      state.nodes.splice(index, 1);
      state.focusIndex = index - 1;
    },
  },
});

export const { updateFocus, onArrow, setData, addBottomNode, deleteNode } = editorSlice.actions;
export default editorSlice.reducer;
