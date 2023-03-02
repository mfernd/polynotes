import { Item } from '@components/vertical-navbar/Item';
import { css } from '@emotion/react';

type ItemNavProps = {
  items: {
    icon?: JSX.Element;
    title: string;
    isCollapsible: boolean;
  }[];
};

export const ItemNav = (props: ItemNavProps) => {
  return (
    <nav css={pageSelectorCss}>
      <ul>
        {props.items.map((item, index) =>
          <li key={`item-${index}`}>
            <Item icon={item.icon} title={item.title} isCollapsible={item.isCollapsible}/>
          </li>)}
      </ul>
    </nav>
  );
};


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
