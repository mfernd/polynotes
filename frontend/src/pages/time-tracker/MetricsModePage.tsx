import { FetchError, useApi } from '@hooks/useApi';
import { Badge, Grid, useToasts } from '@geist-ui/core';
import { useEffect, useState } from 'react';
import { css } from '@emotion/react';

export const MetricsModePage = () => {
  const { setToast } = useToasts();
  const { times: { apiAllProjects, apiAllTags } } = useApi();

  const [projects, setProjects] = useState([] as string[]);
  const [tags, setTags] = useState([] as string[]);

  useEffect(() => {
    apiAllProjects()
        .then(({ projects }) => setProjects(projects))
        .catch(({ error }: FetchError) => setToast({ type: 'error', text: error }));
    apiAllTags()
        .then(({ tags }) => setTags(tags))
        .catch(({ error }: FetchError) => setToast({ type: 'error', text: error }));
  }, []);

  return (
      <div css={containerCss}>
        <article css={sectionCss}>
          <h2>Projets</h2>
          <Grid.Container gap={1} justify={'flex-start'}>
            {projects.map((project, i) =>
                <Grid key={i}>
                  <Badge scale={1.75} type={'success'}>{project}</Badge>
                </Grid>)}
          </Grid.Container>
        </article>

        <article css={sectionCss}>
          <h2>Tags</h2>
          <Grid.Container gap={1} justify={'flex-start'}>
            {tags.map((tag, i) =>
                <Grid key={i}>
                  <Badge scale={1.75} type={'warning'}>{tag}</Badge>
                </Grid>)}
          </Grid.Container>
        </article>

        <article css={sectionCss}>
          <h2>Graphes</h2>
          <div>Soon...</div>
        </article>
      </div>
  );
};

const containerCss = css`
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const sectionCss = css`
  & > h2 {
    font-size: 1.75rem;
  }
`;
