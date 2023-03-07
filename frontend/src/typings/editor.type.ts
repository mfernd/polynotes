export type BlockData = {
  blockId: string;
  type: BlockType;
};

export type BlockType =
  | 'text' // default
  | 'header'
  | 'image'
  | 'table' // views -> kanban, to-do
  | 'bulleted-list'
  | 'numbered-list';