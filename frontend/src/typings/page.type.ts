import { Node } from '@/typings/editor.type';
import { User } from '@/typings/user.type';

export type Page = {
  uuid?: string;
  author?: User;
  title: string;
  nodes: Node[];
};