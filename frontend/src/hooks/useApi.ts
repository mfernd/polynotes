import { useCallback } from 'react';
import { useLocalStorage } from 'react-use';
import { User } from '@/typings/user.type';
import { useNavigate } from 'react-router-dom';

const BASE_API = import.meta.env.VITE_BASE_API;

type ApiState = {
  isAuth: boolean;
  lastLogin: number;
  userInfo?: User;
};

const initialState: ApiState = {
  isAuth: false,
  lastLogin: 0, // as timestamp
  userInfo: undefined,
};

export function useApi() {
  const [apiState, setApiState] = useLocalStorage('polynotes/auth', initialState);
  const navigate = useNavigate();

  // --- GENERIC FETCH
  const fetchWrapper = useCallback(async <ResponseData>(
    { endpoint, method = 'GET', headers, checkJWT, acceptCookies, data }: FetchParams,
  ): Promise<ResponseData> => {
    if (checkJWT && apiState?.isAuth && ((Date.now() - apiState.lastLogin) / 60000) > 11.25) {
      // refresh tokens if almost expired (75% of 15 min)
      await fetchWrapper({ endpoint: '/auth/refresh', acceptCookies: true })
        .then(() => setApiState({ isAuth: true, lastLogin: Date.now() }))
        .catch(() => { // disconnect if cannot refresh
          setApiState(initialState);
          navigate('/login');
        });
    }

    const response = await fetch(`${BASE_API}${endpoint}`, {
      method: method,
      credentials: acceptCookies ? 'include' : undefined,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok)
      throw await response.json();

    return response.json();
  }, [apiState]);

  // --- ALL FUNCTIONAL FETCHES
  return {
    apiState,
    auth: {
      apiLogin: (email: string, password: string) => fetchWrapper<{ user: User }>({
        endpoint: '/auth/login',
        method: 'POST',
        acceptCookies: true,
        data: { email, password },
      }).then((resp) => {
        setApiState({
          isAuth: true,
          lastLogin: Date.now(),
          userInfo: resp.user,
        });
        return resp;
      }),

      apiLogout: () => fetchWrapper<{ message: string }>({ endpoint: '/auth/logout', checkJWT: true, acceptCookies: true })
        .then((resp) => {
          setApiState(initialState);
          return resp;
        }),

      apiRegister: (
        username: string,
        email: string,
        password: string,
        age: boolean,
        cgu: boolean,
      ) => fetchWrapper<{ message: string }>({
        endpoint: '/auth/register',
        method: 'POST',
        data: { username, email, password, age, cgu },
      }),

      apiVerifyEmail: (userUuid: string, nonce: string) => fetchWrapper<{ message: string }>(
        { endpoint: `/auth/verify-email/${userUuid}?${new URLSearchParams({ nonce }).toString()}` },
      ),
    },
  };
}

type FetchParams = {
  endpoint: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  // To refresh tokens if almost expired
  checkJWT?: boolean;
  // To accept cookies from backend
  acceptCookies?: boolean;
  data?: { [key: string]: any };
};

export type FetchError = {
  error: string;
};
