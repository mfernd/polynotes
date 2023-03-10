import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Node } from '@/typings/editor.type';
import { v4 as uuidv4 } from 'uuid';

export type NodeState = {
  focusedNode: string;
  cursorIndex: number;
  nodes: Node[];
};

const initialState: NodeState = {
  focusedNode: '',
  cursorIndex: 0,
  nodes: [
    { id: uuidv4(), type: 'text', data: '' },
  ],
};

export const editorSlice = createSlice({
  name: 'editorNode',
  initialState,
  reducers: {
    updateFocus: (state, nodeId: PayloadAction<string>) => {
      const index = state.nodes.findIndex((node) => node.id === nodeId.payload);
      state.focusedNode = nodeId.payload;
    },
    updateCursor: (state, previousCursorIndex: PayloadAction<number>) => {
      // TODO: problem with ArrowRight and ArrowLeft, one entry late (repeat the action to do it...
      console.log('cursor:', previousCursorIndex.payload);
      state.cursorIndex = previousCursorIndex.payload;
    },
    updateData: (state, newData: PayloadAction<any>) => {
      const index = state.nodes.findIndex((node) => node.id === state.focusedNode);
      if (index === -1) return;

      state.nodes[index].data = newData.payload;
    },
    onArrow: (state, isUp: PayloadAction<{ orientation: 'up' | 'down', cursorIndex: number }>) => {
      const index = state.nodes.findIndex((node) => node.id === state.focusedNode);
      if (index === -1) return;

      if (isUp.payload.orientation === 'up' && index > 0)
        state.focusedNode = state.nodes[index - 1].id;
      if (isUp.payload.orientation === 'down' && index < state.nodes.length - 1)
        state.focusedNode = state.nodes[index + 1].id;
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

      console.log('delete index:', index  );
      if (index === 0)
        state.focusedNode = state.nodes[index + 1].id;
      else
        state.focusedNode = state.nodes[index - 1].id;
      state.nodes.splice(index, 1);
    },
  },
});

export const { updateFocus, updateCursor, updateData, onArrow, addBottomNode, deleteNode } = editorSlice.actions;
export default editorSlice.reducer;
