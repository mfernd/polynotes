import { FetchError, useApi } from '@hooks/useApi';
import { Badge, Grid, useToasts, Text } from '@geist-ui/core';
import { useEffect, useState } from 'react';
import { css } from '@emotion/react';
import { PieChart } from '@components/time-tracker/PieChart';

import 'billboard.js/dist/theme/graph.css';
import { StatsSanitized } from '@/typings/time.type';

export const MetricsModePage = () => {
  const { setToast } = useToasts();
  const { times: { apiAllProjects, apiAllTags, apiProjectStats } } = useApi();

  const [projects, setProjects] = useState([] as string[]);
  const [tags, setTags] = useState([] as string[]);
  const [stats, setStats] = useState<StatsSanitized>({
    counts: [],
    durations: [],
  });

  useEffect(() => {
    apiAllProjects()
        .then(({ projects }) => setProjects(projects))
        .catch(({ error }: FetchError) => setToast({ type: 'error', text: error }));
    apiAllTags()
        .then(({ tags }) => setTags(tags))
        .catch(({ error }: FetchError) => setToast({ type: 'error', text: error }));
    apiProjectStats()
        .then((stats): StatsSanitized => {
          const countStats = [] as [string, number][];
          const durationStats = [] as [string, number][];
          stats.forEach((stat) => {
            countStats.push([stat.project, stat.count]);
            durationStats.push([stat.project, stat.duration]);
          });

          return { counts: countStats, durations: durationStats };
        })
        .then((stats) => setStats(stats))
        .catch(({ error }: FetchError) => setToast({ type: 'error', text: error }));
  }, []);

  return (
      <div css={containerCss}>
        <div css={flexRow}>
          <article css={articleCss}>
            <h2>Nombre de temps par projet</h2>
            <Text small>Durée : Depuis toujours</Text>
            <PieChart columnsData={stats.counts}
                      formatLabel={(value) => `${value} temps`}/>
          </article>

          <article css={articleCss}>
            <h2>Durée des temps par projet</h2>
            <Text small>Durée : Depuis toujours</Text>
            <PieChart columnsData={stats.durations}
                      formatLabel={(value) => `${value / 60 / 60} heures`}/>
          </article>
        </div>

        <article css={articleCss}>
          <h2>Projets ({projects.length})</h2>
          <Grid.Container gap={1} justify={'flex-start'}>
            {projects.map((project, i) =>
                <Grid key={i}>
                  {project !== ''
                      ? <Badge scale={1.5} type={'success'}>{project}</Badge>
                      : <Badge scale={1.5} type={'secondary'}>Projet par défaut</Badge>}
                </Grid>)}
          </Grid.Container>
        </article>

        <article css={articleCss}>
          <h2>Tags ({tags.length})</h2>
          <Grid.Container gap={1} justify={'flex-start'}>
            {tags.map((tag, i) =>
                <Grid key={i}>
                  <Badge scale={1.5} type={'warning'}>{tag}</Badge>
                </Grid>)}
          </Grid.Container>
        </article>
      </div>
  );
};

const containerCss = css`
  margin-top: 1rem;
  margin-bottom: 100px;
  display: flex;
  flex-direction: column;
  gap: 50px;
`;

const flexRow = css`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  
  h2 {
    margin-bottom: 0;
  }
`;

const articleCss = css`
  h2 {
    font-size: 1.75rem;
  }
`;
