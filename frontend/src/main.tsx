import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { LandingPage } from '@pages/LandingPage';
import { LoginPage } from '@pages/LoginPage';
import { RegisterPage } from '@pages/RegisterPage';
import { WorkspacePage } from '@pages/WorkspacePage';
import { EditorPage } from '@pages/EditorPage';
import { Provider } from 'react-redux';
import { store } from '@/store';
import '@assets/main.css';

export const appName = 'Polynotes';

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
    <Provider store={store}>
      <RouterProvider router={router}/>
    </Provider>
  </React.StrictMode>,
);
