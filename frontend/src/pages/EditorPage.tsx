import { MainFrame } from '@components/MainFrame';
import { useParams } from 'react-router-dom';
import { css } from '@emotion/react';
import { EditorNode } from '@components/editor/EditorNode';
import { Dispatch, RootState } from '@/store';
import { connect } from 'react-redux';

const mapState = (state: RootState) => ({
  editorNode: state.editorNode,
});

const mapDispatch = (dispatch: Dispatch) => ({
  addBottomNode: dispatch.editorNode.addBottomNode,
  removeNode: dispatch.editorNode.removeNode,
});

type EditorPageProps = ReturnType<typeof mapState> & ReturnType<typeof mapDispatch>;

export const EditorPage = connect(mapState, mapDispatch)((props: EditorPageProps) => {
  const { pageId } = useParams();

  return (
    <MainFrame>
      <div css={css`padding-left: 2.5rem;`}>
        <h1>Nouvelle page <small css={css`font-size: 0.75rem`}>{pageId}</small></h1>

        <div css={editorContainerCss}>
          {props.editorNode?.nodes.map((node, id) => (
            <EditorNode key={id}
                        id={node.id}
                        type={node.type}
                        isFocused={id === props.editorNode?.focusIndex}
                        placeholder={id === props.editorNode?.nodes.length - 1
                          ? 'Appuyez sur / pour afficher les commandes…'
                          : undefined}/>
          ))}
        </div>
      </div>
    </MainFrame>
  );
});

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
