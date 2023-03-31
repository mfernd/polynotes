import { ReactNode } from 'react';
import { css } from '@emotion/react';
import { FaUserCircle } from 'react-icons/all';
import { useTitle } from 'react-use';
import { appName } from '@/main';
import { VerticalNavbar } from '@components/vertical-navbar/VerticalNavbar';
import { SearchBar } from '@components/ui/SearchBar';

type MainFrameProps = {
  titlePage?: string;
  children?: ReactNode;
};

export const MainFrame = ({ titlePage, children }: MainFrameProps) => {
  useTitle(titlePage ? `${titlePage} - ${appName}` : appName);

  return (
    <div css={containerCss}>
      <VerticalNavbar/>

      <div css={frameCss}>
        <header css={headerNavbarCss}>
          <div className={'left-column'}>
            <SearchBar/>
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
  color: #333;
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
  padding: 0 1.5rem;
  box-shadow: rgba(0 0 0 / 5%) 0px -1px 0px 0px inset;

  .left-column, .right-column {
    height: 100%;
    display: flex;
    align-items: center;
  }

  .left-column {
    width: 100%;
    max-width: 600px;
  }
`;

const accountButtonCss = css`
  cursor: pointer;
  height: 40px;
  width: auto;
  aspect-ratio: 1;

  &:active {
    color: rgba(25, 23, 17, 0.5);
  }
`;
