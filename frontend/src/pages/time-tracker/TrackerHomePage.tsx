import { MainFrame } from '@components/MainFrame';
import { Tabs } from '@geist-ui/core';
import { BsViewList, FiEye } from 'react-icons/all';
import { Button } from '@components/ui/Button';
import { css } from '@emotion/react';
import { useState } from 'react';
import { MetricsModePage } from '@pages/time-tracker/MetricsModePage';
import { ListModePage } from '@pages/time-tracker/ListModePage';

import 'rsuite/dist/rsuite-no-reset.min.css';

const TabValues = {
  metrics: 'metrics',
  list: 'list',
};

export const TrackerHomePage = () => {
  const [selectedTab, setSelectedTab] = useState(TabValues.list);

  let selectedPage: JSX.Element;
  switch (selectedTab) {
    case TabValues.metrics:
      selectedPage = <MetricsModePage/>;
      break;
    case TabValues.list:
      selectedPage = <ListModePage/>;
      break;
    default:
      selectedPage = <MetricsModePage/>
  }

  return (
      <MainFrame titlePage={'Time tracker'}>
        <div css={navBarCss}>
          <Tabs initialValue={selectedTab}
                align={'left'}
                leftSpace={0}
                onChange={(val) => setSelectedTab(val)}>
            <Tabs.Item label={<><FiEye /> Métriques</>} value={TabValues.metrics}/>
            <Tabs.Item label={<><BsViewList/> Liste</>} value={TabValues.list}/>
          </Tabs>
          <div>
            <Button buttonProperties={{padding: '0.5rem 2.5rem'}}>Créer</Button>
          </div>
        </div>

        {selectedPage}
      </MainFrame>
  );
};

const navBarCss = css`
  display: flex;
  justify-content: space-between;
  gap: 2rem;
  padding-left: 1rem;
  
  .tabs {
    flex: 1;
  }
`;
