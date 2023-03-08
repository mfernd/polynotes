import { RootModel } from '@/models/index';
import { createModel } from '@rematch/core';
import { ulid } from 'ulid';
import { NodeData } from '@/typings/editor.type';

type EditorNodeState = {
  focusIndex: number;
  nodes: NodeData[];
};

export const editorNode = createModel<RootModel>()({
  state: {
    focusIndex: 0,
    nodes: [
      { id: ulid(), type: 'text' },
    ],
  } as EditorNodeState,
  reducers: {
    addBottomNode(previousState: EditorNodeState, nodeId: string): EditorNodeState {
      const nodeIndex = previousState.nodes.findIndex((node) => node.id === nodeId);
      if (nodeIndex === -1) return previousState;

      return {
        focusIndex: nodeIndex + 1,
        nodes: [...previousState.nodes, { id: ulid(), type: 'text' }],
      };
    },
  },
});