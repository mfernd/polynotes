import { useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { css } from '@emotion/react';
import { BsStopwatch, FiClock, FiDatabase, FiPlus, FiStar, FiTrash2, MdWorkspaces } from 'react-icons/all';
import { useToasts } from '@geist-ui/core';
import { Button } from '@components/ui/Button';
import { ItemNav } from '@components/vertical-navbar/ItemNav';
import { FetchError, useApi } from '@hooks/useApi';
import logoLarge from '@assets/images/logo-large.svg';

export const VerticalNavbar = () => {
  const navigate = useNavigate();
  const { pages: { apiUpsertPage } } = useApi();
  const { setToast } = useToasts();

  const createPage = useCallback(() => {
    apiUpsertPage()
      .then(({ pageUuid }) => navigate(`/pages/${pageUuid}`))
      .catch(({ error }: FetchError) => setToast({ type: 'warning', text: error }));
  }, [navigate, apiUpsertPage]);

  return (
    <aside css={navbarCss}>
      <Link to={'/workspace'} css={css`width: 100%;`}>
        <img src={logoLarge} alt={'Polynotes large logo'}/>
      </Link>
      <Button buttonProperties={{ initHeight: 1, addHeight: 1, isFullWidth: false }}
              onClick={createPage}>
        <FiPlus/>
        <span>Créer</span>
      </Button>
      <ItemNav items={[
        {
          icon: <MdWorkspaces/>,
          title: 'Mon espace de travail',
          isCollapsible: false,
          link: '/workspace',
        },
        {
          icon: <BsStopwatch/>,
          title: 'Time tracker',
          isCollapsible: false,
          link: '/times',
        },
        {
          icon: <FiDatabase/>,
          title: 'Bases de données',
          isCollapsible: false,
        },
        {
          icon: <FiPlus/>,
          title: 'Ajouter une page',
          isCollapsible: false,
          onClick: createPage,
        },
      ]}/>
      <ItemNav items={[
        {
          icon: <FiClock/>,
          title: 'Récents',
          isCollapsible: false,
        },
        {
          icon: <FiStar/>,
          title: 'Suivis',
          isCollapsible: false,
        },
        {
          icon: <FiTrash2/>,
          title: 'Corbeille',
          isCollapsible: false,
        },
      ]}/>
    </aside>
  );
};

const navbarCss = css`
  padding: 1rem 1rem 0;
  min-height: 100vh;

  background-color: #fafafa;
  box-shadow: rgba(0 0 0 / 5%) -1px 0px 0px 0px inset;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;

  ul {
    color: rgba(25, 23, 17, 0.75);
    font-weight: 500;
  }
`;
