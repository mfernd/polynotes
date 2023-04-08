import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { CssBaseline, GeistProvider } from '@geist-ui/core';
import { AppRoutes } from '@/AppRoutes';
import { store } from '@/store';
import '@assets/main.css';

export const appName = 'Polynotes';

const App = () => {
  const routes = AppRoutes();

  return (
    <StrictMode>
      <Provider store={store}>
        <GeistProvider>
          <CssBaseline/>
          <RouterProvider router={routes}/>
        </GeistProvider>
      </Provider>
    </StrictMode>
  );
};

createRoot(document.querySelector('#app') as HTMLElement).render(<App/>);
