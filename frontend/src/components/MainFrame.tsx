import { VerticalNavbar } from '@components/vertical-navbar/VerticalNavbar';
import { ReactNode, useState } from 'react';
import { css } from '@emotion/react';
import { FaUserCircle } from 'react-icons/all';
import { InputText } from '@components/ui/InputText';
import { useTitle } from 'react-use';
import { appName } from '@/main';

type MainFrameProps = {
  titlePage?: string;
  children?: ReactNode;
};

export const MainFrame = ({ titlePage, children }: MainFrameProps) => {
  useTitle(titlePage ? `${titlePage} - ${appName}` : appName);
  const [searchBar, setSearchBar] = useState('');

  return (
    <div css={containerCss}>
      <VerticalNavbar/>

      <div css={frameCss}>
        <header css={headerNavbarCss}>
          <div className={'left-column'}>
            <InputText type={'text'}
                       value={searchBar}
                       onChange={(e) => setSearchBar(e.target.value)}
                       autoComplete={'on'}
                       placeholder={'🔎 Search'}/>
          </div>
          <div className={'right-column'}>
            <FaUserCircle css={accountButtonCss}/>
          </div>
        </header>
        <main css={mainCss}>
          {children}
        </main>
      </div>
    </div>
  );
};

const containerCss = css`
  display: flex;
  color: rgba(25, 23, 17, 0.6);
`;

const frameCss = css`
  width: 0;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  background-color: #fff;
`;

const mainCss = css`
  width: 100%;
  overflow-x: clip;
  flex-grow: 1;
  color: #000;
  padding: 1rem 1.5rem 0;

  display: flex;
  flex-direction: column;
`;

const headerNavbarCss = css`
  height: 70px;
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  box-shadow: rgba(0 0 0 / 5%) 0px -1px 0px 0px inset;

  .left-column, .right-column {
    height: 100%;
    display: flex;
    align-items: center;
    padding: 10px 0;
  }

  .left-column {
    width: 100%;
    max-width: 600px;
  }
`;

const accountButtonCss = css`
  cursor: pointer;
  height: 100%;
  width: auto;
  aspect-ratio: 1;
`;
