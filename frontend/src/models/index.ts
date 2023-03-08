import { Models } from '@rematch/core';
import { editorNode } from '@/models/editor-node';

export interface RootModel extends Models<RootModel> {
  editorNode: typeof editorNode;
}

export const models: RootModel = {
  editorNode,
};
