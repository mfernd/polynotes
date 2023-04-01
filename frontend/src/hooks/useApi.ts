import { useLocalStorage } from 'react-use';
import { User } from '@/typings/user.type';

const BASE_API = import.meta.env.VITE_BASE_API;

type ApiState = {
  isAuth: boolean;
  lastLogin: number;
  userInfo?: User;
};

export function useApi() {
  const [
    apiState,
    setApiState,
  ] = useLocalStorage('polynotes/auth', {
    isAuth: false,
    lastLogin: 0, // as timestamp
    userInfo: undefined,
  } as ApiState);

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
      apiLogout: fetchWrapper<{ message: string }>({
        endpoint: '/auth/logout',
        method: 'GET',
      }),
      // TODO: check if refresh token expired
      apiRefresh: fetchWrapper<{ message: string }>({
        endpoint: '/auth/refresh',
        method: 'GET',
      }).then((resp) => {
        setApiState({ isAuth: true, lastLogin: Date.now() });
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
    },
  };
}

type FetchParams = {
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  data?: { [key: string]: any };
};

export type FetchError = {
  error: string;
};

const fetchWrapper = async <ResponseData>(request: FetchParams): Promise<ResponseData> => {
  const response = await fetch(`${BASE_API}${request.endpoint}`, {
    method: request.method,
    headers: {
      'Content-Type': 'application/json',
      ...request.headers,
    },
    body: JSON.stringify(request.data),
  });

  if (!response.ok)
    throw await response.json();

  return response.json();
};
