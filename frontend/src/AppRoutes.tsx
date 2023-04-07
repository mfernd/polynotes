import { createBrowserRouter } from 'react-router-dom';
import { LandingPage } from '@pages/LandingPage';
import { ProtectedRoute } from '@components/ProtectedRoute';
import { WorkspacePage } from '@pages/WorkspacePage';
import { EditorPage } from '@pages/EditorPage';
import { LoginPage } from '@pages/LoginPage';
import { RegisterPage } from '@pages/RegisterPage';
import { AfterVerificationPage } from '@pages/verify-email/AfterVerificationPage';
import { BeforeVerificationPage } from '@pages/verify-email/BeforeVerificationPage';
import { ContentNotFound } from '@pages/errors/ContentNotFound';
import { useApi } from '@hooks/useApi';

export const AppRoutes = () => {
  const { pages: { apiFindPage } } = useApi();

  return createBrowserRouter([
    // ALL
    {
      path: '/landing',
      element: <LandingPage/>,
    },
    {
      path: '/verify-email',
      element: <BeforeVerificationPage/>,
    },
    {
      path: '/verify-email/:userUuid/:nonce',
      element: <AfterVerificationPage/>,
    },
    // IF AUTH
    {
      path: '/workspace',
      element: <ProtectedRoute needsAuth elsePath={'/login'} children={<WorkspacePage/>}/>,
    },
    {
      path: '/pages/:pageId',
      element: <ProtectedRoute needsAuth elsePath={'/login'} children={<EditorPage/>}/>,
      loader: ({ params }) => apiFindPage(params.pageId ?? ''),
    },
    {
      path: '/errors/content-not-found',
      element: <ProtectedRoute needsAuth elsePath={'/login'} children={<ContentNotFound/>}/>,
    },
    // IF NO AUTH
    {
      path: '/',
      element: <ProtectedRoute needsAuth={false} elsePath={'/workspace'} children={<LandingPage/>}/>,
    },
    {
      path: '/login',
      element: <ProtectedRoute needsAuth={false} elsePath={'/workspace'} children={<LoginPage/>}/>,
    },
    {
      path: '/register',
      element: <ProtectedRoute needsAuth={false} elsePath={'/workspace'} children={<RegisterPage/>}/>,
    },
  ]);
};