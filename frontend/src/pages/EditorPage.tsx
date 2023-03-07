import { MainFrame } from '@components/MainFrame';
import { useParams } from 'react-router-dom';
import { css } from '@emotion/react';
import { EditorBlock } from '@components/editor/EditorBlock';
import { useCallback, useRef, useState } from 'react';
import { BlockData } from '@/typings/editor.type';
import { ulid } from 'ulid';

export const EditorPage = () => {
  const { pageId } = useParams();

  const [editor, setEditor] = useState<BlockData[]>([
    { blockId: ulid(), type: 'text' },
  ]);

  const addBlock = useCallback(() => {
    setEditor(prevState => [...prevState, { blockId: ulid(), type: 'text' }]);
  }, [editor]);

  const removeBlock = useCallback((blockId: string) => {
    if (0 === editor.length - 1) return;
    setEditor(prevState => prevState.filter((block) => block.blockId !== blockId));
  }, [editor]);

  return (
    <MainFrame>
      <div css={css`padding-left: 2.5rem;`}>
        <h1>Nouvelle page</h1>

        <div css={editorContainerCss}>
          {editor.map((block, id) => (
            <EditorBlock key={id} blockId={block.blockId}
                         type={block.type}
                         addBlock={addBlock}
                         removeBlock={removeBlock}
                         placeholder={id === editor.length - 1 ? 'Appuyez sur / pour afficher les commandes…' : undefined}/>
          ))}
        </div>
      </div>
    </MainFrame>
  );
};

const editorContainerCss = css`
  cursor: text;
  padding-bottom: 30vh;

  color: rgb(55, 53, 47);
  caret-color: rgb(55, 53, 47);

  font-size: 16px;
  font-weight: 400;
  white-space: pre-wrap;
  word-break: break-word;
`;
