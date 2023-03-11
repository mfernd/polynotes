import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Node } from '@/typings/editor.type';
import { v4 as uuidv4 } from 'uuid';

export type NodeState = {
  focusedNode: string;
  cursorIndex: number | 'start' | 'end';
  nodes: Node[];
};

const initialState: NodeState = {
  focusedNode: '',
  cursorIndex: 0,
  nodes: [
    { id: uuidv4(), type: 'header', data: '' },
  ],
};

export const editorSlice = createSlice({
  name: 'editorNode',
  initialState,
  reducers: {
    updateFocus: (state, nodeId: PayloadAction<string>) => {
      state.focusedNode = nodeId.payload;
    },
    updateData: (state, newData: PayloadAction<any>) => {
      const index = state.nodes.findIndex((node) => node.id === state.focusedNode);
      if (index === -1) return;

      state.nodes[index].data = newData.payload;
    },
    onArrow: (state, action: PayloadAction<{ orientation: 'up' | 'down', cursorIndex?: number | 'start' | 'end' }>) => {
      const index = state.nodes.findIndex((node) => node.id === state.focusedNode);
      if (index === -1) return;

      if (action.payload.orientation === 'up' && index > 0)
        state.focusedNode = state.nodes[index - 1].id;
      if (action.payload.orientation === 'down' && index < state.nodes.length - 1)
        state.focusedNode = state.nodes[index + 1].id;

      if (undefined !== action.payload.cursorIndex)
        state.cursorIndex = action.payload.cursorIndex;
    },
    addBottomNode: (state, nodeId: PayloadAction<string>) => {
      const index = state.nodes.findIndex((node) => node.id === state.focusedNode);
      if (index === -1) return;

      const uuid = uuidv4();
      state.focusedNode = uuid;
      switch (state.nodes[index].type) {
        default: // text by default for now
          state.nodes.splice(index + 1, 0, { id: uuid, type: 'text', data: '' });
      }
    },
    deleteNode: (state) => {
      if (state.nodes.length === 1) return;
      const index = state.nodes.findIndex((node) => node.id === state.focusedNode);
      if (index === -1) return;

      if (index === 0)
        state.focusedNode = state.nodes[index + 1].id;
      else
        state.focusedNode = state.nodes[index - 1].id;
      state.nodes.splice(index, 1);
    },
  },
});

export const { updateFocus, updateData, onArrow, addBottomNode, deleteNode } = editorSlice.actions;
export default editorSlice.reducer;
