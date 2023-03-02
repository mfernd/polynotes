import logoLarge from '@assets/logo-large.svg';
import { Button } from '@components/ui/Button';
import { FiClock, FiDatabase, FiPlus, FiStar, FiTrash2, MdPeopleAlt, MdWorkspaces } from 'react-icons/all';
import { css } from '@emotion/react';
import { ItemNav } from '@components/vertical-navbar/ItemNav';

export const VerticalNavbar = () => {
  return (
    <aside css={navbarCss}>
      <img src={logoLarge} alt={'PolyNotes large logo'}/>
      <Button buttonProperties={{ initHeight: 1, addHeight: 1, isFullWidth: false }}>
        <FiPlus/>
        <span>Créer</span>
      </Button>
      <ItemNav items={[
        {
          icon: <MdWorkspaces/>,
          title: 'Mon espace de travail',
          isCollapsible: true,
        },
        {
          icon: <MdPeopleAlt/>,
          title: 'Partagé avec moi',
          isCollapsible: true,
        },
        {
          icon: <FiDatabase/>,
          title: 'Bases de données',
          isCollapsible: true,
        },
        {
          icon: <FiPlus/>,
          title: 'Ajouter une page',
          isCollapsible: true,
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
  width: 250px;

  background-color: #fbfbfa;
  box-shadow: rgba(0 0 0 / 5%) -1px 0px 0px 0px inset;
  color: rgba(25, 23, 17, 0.6);
  font-weight: 500;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
`;
