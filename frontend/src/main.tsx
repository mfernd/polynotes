import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { CssBaseline, GeistProvider } from '@geist-ui/core';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';
import { LandingPage } from '@pages/LandingPage';
import { LoginPage } from '@pages/LoginPage';
import { RegisterPage } from '@pages/RegisterPage';
import { WorkspacePage } from '@pages/WorkspacePage';
import { EditorPage } from '@pages/EditorPage';
import { store } from '@/store';
import '@assets/main.css';

export const appName = 'Polynotes';

const queryClient = new QueryClient();
const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage/>,
  },
  {
    path: '/login',
    element: <LoginPage/>,
  },
  {
    path: '/register',
    element: <RegisterPage/>,
  },
  {
    path: '/workspace',
    element: <WorkspacePage/>,
  },
  {
    path: '/page/:pageId',
    element: <EditorPage/>,
  },
]);

ReactDOM.createRoot(document.querySelector('#app') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <GeistProvider>
          <CssBaseline/>
          <RouterProvider router={router}/>
        </GeistProvider>
      </Provider>
    </QueryClientProvider>
  </React.StrictMode>,
);
