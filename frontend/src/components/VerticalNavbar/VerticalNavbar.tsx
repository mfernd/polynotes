import logoLarge from '@assets/logo-large.svg';
import { Button } from '@components/Button';
import { FiClock, FiPlus, FiStar, FiTrash2, MdPeopleAlt, MdWorkspaces } from 'react-icons/all';
import { css } from '@emotion/react';
import { Item } from '@components/VerticalNavbar/Item';

export const VerticalNavbar = () => {
  return (
    <aside css={navbarCss}>
      <img src={logoLarge} alt={'PolyNotes large logo'}/>

      <Button buttonProperties={{ initHeight: 1, addHeight: 1, isFullWidth: false }}>
        <FiPlus/>
        <span>Créer</span>
      </Button>

      <nav css={pageSelectorCss}>
        <ul>
          <li>
            <Item icon={<MdWorkspaces/>} title={'Mon espace de travail'} isCollapsible/>
          </li>
          <li>
            <Item icon={<MdPeopleAlt/>} title={'Partagé avec moi'} isCollapsible/>
          </li>
          <li>
            <Item icon={<FiPlus/>} title={'Ajouter une page'}/>
          </li>
        </ul>
      </nav>

      <nav css={pageSelectorCss}>
        <ul>
          <li>
            <Item icon={<FiClock/>} title={'Récents'}/>
          </li>
          <li>
            <Item icon={<FiStar/>} title={'Suivis'}/>
          </li>
          <li>
            <Item icon={<FiTrash2/>} title={'Corbeille'}/>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

const navbarCss = css`
  padding: 1rem 1rem 0;
  min-height: 100vh;
  width: 250px;

  background-color: #fbfbfa;
  box-shadow: rgb(0 0 0 / 2%) -1px 0px 0px 0px inset;
  color: rgba(25, 23, 17, 0.6);
  font-weight: 500;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
`;

const pageSelectorCss = css`
  font-size: 1rem;
  line-height: 1.5;
  width: 100%;

  ul {
    margin: 0;
    padding-left: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }
`;
