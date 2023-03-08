export type NodeData = {
  id: string;
  type: NodeType;
};

export type NodeType =
  | 'text' // default
  | 'header'
  | 'image'
  | 'table' // views -> kanban, to-do
  | 'bulleted-list'
  | 'numbered-list'
  | 'column';
