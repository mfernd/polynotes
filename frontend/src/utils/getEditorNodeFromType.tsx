import { KeyboardEvent } from 'react';
import { Editor } from '@tiptap/react';
import { DefaultBlockProps, Node } from '@/typings/editor.type';
import { TextBlock } from '@components/editor/blocks/TextBlock';
import { HeadingBlock } from '@components/editor/blocks/HeadingBlock';
import { BulletList } from '@components/editor/blocks/BulletList';
import { NumberList } from '@components/editor/blocks/NumberList';

export const getEditorNodeFromType = (
  node: Node,
  isLastNode?: boolean,
  beforeInput?: (event: KeyboardEvent<HTMLDivElement>, editor: Editor | null) => void,
  afterInput?: (event: KeyboardEvent<HTMLDivElement>, editor: Editor | null) => void,
): JSX.Element => {
  const defaultProps: DefaultBlockProps = {
    node: node,
    onBeforeInput: beforeInput,
    onAfterInput: afterInput,
  };
  switch (node.type) {
    case 'text':
      return <TextBlock {...defaultProps} showPlaceholder={isLastNode}/>;
    case 'header-1':
      return <HeadingBlock {...defaultProps} level={1}/>;
    case 'header-2':
      return <HeadingBlock {...defaultProps} level={2}/>;
    case 'header-3':
      return <HeadingBlock {...defaultProps} level={3}/>;
    case 'bulleted-list':
      return <BulletList {...defaultProps} showPlaceholder={isLastNode}/>;
    case 'numbered-list':
      return <NumberList {...defaultProps} showPlaceholder={isLastNode}/>;
    default:
      return <TextBlock {...defaultProps} showPlaceholder={isLastNode}/>;
  }
};