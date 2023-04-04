import { useCallback } from 'react';
import { useLocalStorage } from 'react-use';
import { User } from '@/typings/user.type';

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

  // --- GENERIC FETCH
  const fetchWrapper = useCallback(async <ResponseData>(
    { endpoint, method = 'GET', headers, checkJWT, acceptCookies, data }: FetchParams,
  ): Promise<ResponseData> => {
    if (checkJWT && apiState?.isAuth) {
      const remaining_minutes = (Date.now() - apiState.lastLogin) / 60000;
      // refresh access_token if almost expired (15 min / 2)
      if (remaining_minutes > 7.5) {
        await fetchWrapper({ endpoint: '/auth/refresh', acceptCookies: true })
          .then(() => setApiState({ isAuth: true, lastLogin: Date.now() }))
          .catch(() => setApiState(initialState));
      }
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

      // TODO: check if access & refresh token expired
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
  checkJWT?: boolean;
  acceptCookies?: boolean;
  data?: { [key: string]: any };
};

export type FetchError = {
  error: string;
};
