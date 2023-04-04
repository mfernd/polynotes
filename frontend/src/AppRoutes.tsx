import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { LandingPage } from '@pages/LandingPage';
import { ProtectedRoute } from '@components/ProtectedRoute';
import { WorkspacePage } from '@pages/WorkspacePage';
import { EditorPage } from '@pages/EditorPage';
import { LoginPage } from '@pages/LoginPage';
import { RegisterPage } from '@pages/RegisterPage';
import { AfterVerificationPage } from '@pages/verify-email/AfterVerificationPage';
import { BeforeVerificationPage } from '@pages/verify-email/BeforeVerificationPage';

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* ALL */}
        <Route path={'/landing'} element={<LandingPage/>}/>
        <Route path={'/verify-email'} element={<BeforeVerificationPage/>}/>
        <Route path={'/verify-email/:userUuid/:nonce'} element={<AfterVerificationPage/>}/>
        {/* IF AUTH */}
        <Route path={'/workspace'} element={
          <ProtectedRoute needsAuth elsePath={'/login'} children={<WorkspacePage/>}/>
        }/>
        <Route path={'/pages/:pageId'} element={
          <ProtectedRoute needsAuth elsePath={'/login'} children={<EditorPage/>}/>
        }/>
        {/* IF NO-AUTH */}
        <Route path={'/'} element={
          <ProtectedRoute needsAuth={false} elsePath={'/workspace'} children={<LandingPage/>}/>
        }/>
        <Route path={'/login'} element={
          <ProtectedRoute needsAuth={false} elsePath={'/workspace'} children={<LoginPage/>}/>
        }/>
        <Route path={'/register'} element={
          <ProtectedRoute needsAuth={false} elsePath={'/workspace'} children={<RegisterPage/>}/>
        }/>
      </Routes>
    </BrowserRouter>
  );
};