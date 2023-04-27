import { MainFrame } from '@components/MainFrame';
import { Tabs, Text } from '@geist-ui/core';
import { AiOutlineEdit, FiEye } from 'react-icons/all';

export const TimeHomePage = () => {
  return (
      <MainFrame titlePage={'Time tracker'}>
        <div>
          <Tabs initialValue='1' align='center' leftSpace={0}>
            <Tabs.Item label={<><FiEye /> View</>} value={'1'}>
              <Text mt={0}>Coucou</Text>
            </Tabs.Item>
            <Tabs.Item label={<><AiOutlineEdit/> Edit</>} value={'2'}>
              <Text mt={0}>Michel</Text>
            </Tabs.Item>
          </Tabs>
        </div>
      </MainFrame>
  );
};