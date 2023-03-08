export type Node = {
  id: string;
  type: NodeType;
  data: any;
};

export type NodeType =
  | 'text' // default
  | 'header'
  | 'image'
  | 'table' // views -> kanban, to-do
  | 'bulleted-list'
  | 'numbered-list'
  | 'column';

export type NodeTextContent = string;
export type NodeHeaderContent = string;
