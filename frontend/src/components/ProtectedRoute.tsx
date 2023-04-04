import { To, useLocation, useNavigate } from 'react-router-dom';
import { useApi } from '@hooks/useApi';
import { useEffect } from 'react';

type ProtectedRouteProps = {
  needsAuth: boolean;
  /** Triggered when `needsAuth` isn't satisfied */
  elsePath: To;
  children: JSX.Element;
};

export const ProtectedRoute = (props: ProtectedRouteProps) => {
  const { apiState } = useApi();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if ((props.needsAuth && !apiState?.isAuth) || (!props.needsAuth && apiState?.isAuth)) {
      navigate(props.elsePath, { replace: true, state: { from: location } });
    }
  }, [apiState]);

  return props.children;
};