import { css } from '@emotion/react';
import cgu from '@/assets/json/cgu.json';

export const CguPage = () => {
  return (
    <main css={cguCss}>
      <div css={css`text-align: justify;`}>
        <h1>{cgu.title}</h1>
        <div>
          <p style={{marginBottom: '3rem'}}>{cgu.text}</p>

          <ol>
            {cgu.children.map((term, i) => (
              <li key={i}>
                <h2>{term.title}</h2>
                <p>{term.text}</p>
              </li>))}
          </ol>
        </div>
      </div>
    </main>
  );
};

const cguCss = css`
  width: 100%;
  max-width: 750px;
  margin: 0 auto;
  padding: 0 1rem;
  text-align: justify;
  
  p {
    font-size: 1.25rem;
  }
  
  li {
    margin-bottom: 3rem;
  }
`;
