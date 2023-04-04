import { User } from '@/typings/user.type';
import { useCallback } from 'react';
import { useLocalStorage } from 'react-use';

const BASE_API = import.meta.env.VITE_BASE_API;

type ApiState = {
  isAuth: boolean;
  lastLogin: number;
  userInfo?: User;
};

export function useApi() {
  const [apiState, setApiState] = useLocalStorage('polynotes/auth', {
    isAuth: false,
    lastLogin: 0, // as timestamp
    userInfo: undefined,
  } as ApiState);

  const fetchWrapper = useCallback(async <ResponseData>(
    { endpoint, method = 'GET', headers, hasJWT, data }: FetchParams,
  ): Promise<ResponseData> => {
    if (hasJWT && apiState && apiState.isAuth) { // refresh access_token if expired
      // TODO refresh
      console.log(Date.now() - apiState.lastLogin);
      fetchWrapper({ endpoint: '/auth/refresh' })
        .then(() => setApiState({ isAuth: true, lastLogin: Date.now() }))
        .catch(() => setApiState({ isAuth: false, lastLogin: 0, userInfo: undefined }));
    }
    const response = await fetch(`${BASE_API}${endpoint}`, {
      method: method,
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

  return {
    apiState,
    auth: {
      apiLogin: (email: string, password: string) => fetchWrapper<{ user: User }>({
        endpoint: '/auth/login',
        method: 'POST',
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
      apiLogout: () => fetchWrapper<{ message: string }>({ endpoint: '/auth/logout', hasJWT: true }),
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
  hasJWT?: boolean;
  data?: { [key: string]: any };
};

export type FetchError = {
  error: string;
};
