import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { CssBaseline, GeistProvider } from '@geist-ui/core';
import { AppRoutes } from '@/AppRoutes';
import { store } from '@/store';
import '@assets/main.css';

export const appName = 'Polynotes';

const App = () => {
  return (
    <StrictMode>
      <Provider store={store}>
        <GeistProvider>
          <CssBaseline/>
          <AppRoutes/>
        </GeistProvider>
      </Provider>
    </StrictMode>
  );
};

createRoot(document.querySelector('#app') as HTMLElement).render(<App/>);
