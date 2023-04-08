import { ReactNode, useCallback } from 'react';
import { css } from '@emotion/react';
import { useTitle } from 'react-use';
import { appName } from '@/main';
import { VerticalNavbar } from '@components/vertical-navbar/VerticalNavbar';
import { SearchBar } from '@components/ui/SearchBar';
import { Avatar, Popover, useToasts } from '@geist-ui/core';
import { FetchError, useApi } from '@hooks/useApi';
import { BsFillPersonFill, FaSignOutAlt } from 'react-icons/all';
import { useNavigate } from 'react-router-dom';

type MainFrameProps = {
  titlePage?: string;
  children?: ReactNode;
};

export const MainFrame = ({ titlePage, children }: MainFrameProps) => {
  useTitle(titlePage ? `${titlePage} - ${appName}` : appName);

  const { setToast } = useToasts();
  const navigate = useNavigate();
  const { apiState, auth: { apiLogout } } = useApi();

  const logout = useCallback(() => {
    apiLogout()
      .then(() => {
        setToast({ type: 'success', text: 'Déconnecté avec succès 👍' });
        navigate('/login');
      })
      .catch((data: FetchError) => setToast({ type: 'error', text: data.error }));
  }, [apiState]);

  const userDropdown = (
    <>
      <Popover.Item css={popoverItemCss}>
        <BsFillPersonFill/>
        <span>Profil</span>
      </Popover.Item>
      <Popover.Item line/>
      <Popover.Item onClick={logout} css={popoverItemCss}>
        <FaSignOutAlt/>
        <span>Se{' '}déconnecter</span>
      </Popover.Item>
    </>
  );

  return (
    <div css={containerCss}>
      <VerticalNavbar/>

      <div css={frameCss}>
        <header css={headerNavbarCss}>
          <div className={'left-column'}>
            <SearchBar/>
          </div>
          <div className={'right-column'}>
            <Popover hideArrow
                     placement={'bottomEnd'}
                     content={userDropdown}>
              <Avatar width={'50px'} height={'50px'}
                      text={apiState?.userInfo?.username!.substring(0, 3).toUpperCase() ?? ''}/>
            </Popover>
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
  gap: 1rem;
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

  .right-column * {
    cursor: pointer !important;
  }
`;

const popoverItemCss = css`
  min-width: max-content;
  width: 100%;
  gap: 10px;
  cursor: pointer !important;
`;
