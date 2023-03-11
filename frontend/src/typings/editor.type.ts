import { KeyboardEvent } from 'react';
import { Editor } from '@tiptap/react';

export type Node = {
  id: string;
  type: NodeType;
  data?: string;
};

export type NodeType =
  | 'text' // default
  | 'header-1'
  | 'header-2'
  | 'header-3'
  | 'image'
  | 'table' // views -> kanban, to-do
  | 'bulleted-list'
  | 'numbered-list'
  | 'column';

export type DefaultBlockProps = {
  block: Node;
  onInput: (event: KeyboardEvent<HTMLDivElement>, editor: Editor | null) => void;
  showPlaceholder?: boolean;
};
