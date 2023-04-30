import { useState } from 'react';
import { Tabs } from '@geist-ui/core';
import { AiOutlinePlus, BsViewList, FiEye } from 'react-icons/all';
import { css } from '@emotion/react';
import { MainFrame } from '@components/MainFrame';
import { Button } from '@components/ui/Button';
import { MetricsModePage } from '@pages/time-tracker/MetricsModePage';
import { ListModePage } from '@pages/time-tracker/ListModePage';

import 'rsuite/dist/rsuite-no-reset.min.css';
import { TimeForm } from '@components/time-tracker/TimeForm';

const TabValues = {
  metrics: 'metrics',
  list: 'list',
};

export const TrackerHomePage = () => {
  const [modalVisibility, setModalVisibility] = useState(false);

  const [selectedTab, setSelectedTab] = useState(TabValues.metrics);
  let selectedPage: JSX.Element;
  switch (selectedTab) {
    case TabValues.metrics:
      selectedPage = <MetricsModePage/>;
      break;
    case TabValues.list:
      selectedPage = <ListModePage/>;
      break;
    default:
      selectedPage = <MetricsModePage/>;
  }

  return (
      <MainFrame titlePage={'Time tracker'}>
        <div css={navBarCss}>
          <Tabs initialValue={selectedTab}
                align={'left'}
                leftSpace={0}
                onChange={(val) => setSelectedTab(val)}>
            <Tabs.Item label={<><FiEye/> Métriques</>} value={TabValues.metrics}/>
            <Tabs.Item label={<><BsViewList/> Liste</>} value={TabValues.list}/>
          </Tabs>
          <div>
            <Button buttonProperties={{ padding: '0.5rem 1.5rem' }}
                    onClick={() => setModalVisibility(true)}>
              <AiOutlinePlus/>
              <span>Créer un temps</span>
            </Button>
            {modalVisibility
                ? <TimeForm isVisible={modalVisibility} onClosing={() => setModalVisibility(false)}/>
                : null}
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

  .tabs {
    flex: 1;
  }

  .tabs header {
    overflow: visible;
  }
`;
