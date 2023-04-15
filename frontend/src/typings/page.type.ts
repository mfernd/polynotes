import { NodeType } from '@/typings/editor.type';
import { User } from '@/typings/user.type';

export type Page = {
  uuid?: string;
  author: User;
  title: string;
  nodes: PageNode[];
  createdAt: number;
  updatedAt: number;
};

export type ShortPage = {
  uuid: string;
  title: string;
  createdAt: number;
  updatedAt: number;
};

export type PageNode = {
  uuid: string;
  type: NodeType;
  data: string;
};
