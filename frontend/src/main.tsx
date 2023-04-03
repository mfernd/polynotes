import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { CssBaseline, GeistProvider } from '@geist-ui/core';
import { ProtectedRoute } from '@components/ProtectedRoute';
import { LandingPage } from '@pages/LandingPage';
import { LoginPage } from '@pages/LoginPage';
import { RegisterPage } from '@pages/RegisterPage';
import { WorkspacePage } from '@pages/WorkspacePage';
import { EditorPage } from '@pages/EditorPage';
import { store } from '@/store';
import '@assets/main.css';

export const appName = 'Polynotes';

const App = () => {
  const routes = (
    <BrowserRouter>
      <Routes>
        {/* ALL */}
        <Route path={'/landing'} element={<LandingPage/>}/>
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

  return (
    <StrictMode>
      <Provider store={store}>
        <GeistProvider>
          <CssBaseline/>
          {routes}
        </GeistProvider>
      </Provider>
    </StrictMode>
  );
};

createRoot(document.querySelector('#app') as HTMLElement).render(<App/>);
