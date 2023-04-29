import { useCallback } from 'react';
import { useLocalStorage } from 'react-use';
import { User } from '@/typings/user.type';
import { redirect } from 'react-router-dom';
import { Node } from '@/typings/editor.type';
import { v4 as uuidv4 } from 'uuid';
import { Page, ShortPage } from '@/typings/page.type';
import { Time } from '@/typings/time.type';
import moment from 'moment';

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
    { endpoint, method = 'GET', headers, secure, acceptCookies, data }: FetchParams,
  ): Promise<ResponseData> => {
    if (secure && apiState?.isAuth && ((Date.now() - apiState.lastLogin) / 60000) > 11.25) {
      // refresh tokens if almost expired (75% of 15 min)
      await fetchWrapper({ endpoint: '/auth/refresh', acceptCookies: true })
        .then(() => setApiState({ ...apiState, isAuth: true, lastLogin: Date.now() }))
        .catch(() => { // disconnect if cannot refresh
          setApiState(initialState);
          redirect('/login');
        });
    }

    const response = await fetch(`${BASE_API}${endpoint}`, {
      method: method,
      credentials: acceptCookies || secure ? 'include' : undefined,
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
      apiLogin: (email: string, password: string) => {
        return fetchWrapper<{ user: User }>({
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
        });
      },
      apiLogout: () => {
        return fetchWrapper<{ message: string }>({ endpoint: '/auth/logout', secure: true })
          .then((resp) => {
            setApiState(initialState);
            return resp;
          });
      },
      apiRegister: (username: string, email: string, password: string, age: boolean, cgu: boolean) => {
        return fetchWrapper<{ message: string }>({
          endpoint: '/auth/register',
          method: 'POST',
          data: { username, email, password, age, cgu },
        });
      },
      apiVerifyEmail: (userUuid: string, nonce: string) => {
        return fetchWrapper<{ message: string }>(
          { endpoint: `/auth/verify-email/${userUuid}?${new URLSearchParams({ nonce }).toString()}` },
        );
      },
    },

    pages: {
      apiFindPage: (pageUuid: String) => {
        return fetchWrapper<Page>({
          endpoint: `/pages/${pageUuid}`,
          secure: true,
        }).catch(() => redirect('/errors/content-not-found'));
      },
      apiUpsertPage: (pageUuid?: String, title?: String, nodes?: Node[]) => {
        return fetchWrapper<{ pageUuid: string }>({
          endpoint: '/pages',
          method: 'PUT',
          secure: true,
          data: {
            uuid: pageUuid,
            title: title ?? '',
            nodes: nodes ?? [{ uuid: uuidv4(), type: 'text', data: '' }],
          },
        });
      },
      apiDeletePage: (pageUuid: string) => {
        return fetchWrapper<{ message: string }>({ endpoint: `/pages/${pageUuid}`, method: 'DELETE', secure: true });
      },
    },

    users: {
      apiUserPages: () => {
        // if (limit) {
        // const params = new URLSearchParams({ limit: `${limit}` });
        //   return fetchWrapper<ShortPage[]>({ endpoint: `/users/me/pages?${params}`, secure: true });
        // }
        return fetchWrapper<ShortPage[]>({ endpoint: `/users/me/pages`, secure: true });
      },
      apiRecentPages: (limit?: number) => {
        if (limit) {
          const params = new URLSearchParams({ limit: `${limit}` });
          return fetchWrapper<ShortPage[]>({ endpoint: `/users/me/pages/recent?${params}`, secure: true });
        }
        return fetchWrapper<ShortPage[]>({ endpoint: `/users/me/pages/recent`, secure: true });
      },
    },

    times: {
      apiGetTimesFromRange: (from: Date, to: Date) => {
        if (undefined === apiState || undefined === apiState.userInfo) throw 'Not connected';

        const dateFrom = moment(from).format('YYYY-MM-DD');
        const dateTo = moment(to).format('YYYY-MM-DD');

        return fetchWrapper<Time[]>({
          endpoint: `/users/${apiState.userInfo.uuid}/times/search/${dateFrom}/to/${dateTo}`,
          secure: true,
        });
      },
      apiFindTime: (timeUuid: string) => {
        if (undefined === apiState || undefined === apiState.userInfo) throw 'Not connected';

        return fetchWrapper<Time>({
          endpoint: `/users/${apiState.userInfo.uuid}/times/${timeUuid}`,
          secure: true,
        });
      },
      apiDeleteTime: (timeUuid: string) => {
        if (undefined === apiState || undefined === apiState.userInfo) throw 'Not connected';

        return fetchWrapper<{ message: string; }>({
          method: 'DELETE',
          endpoint: `/users/${apiState.userInfo.uuid}/times/${timeUuid}`,
          secure: true,
        });
      },
      apiUpsertTime: (time: Time) => {
        if (undefined === apiState || undefined === apiState.userInfo) throw 'Not connected';

        return fetchWrapper<Time>({
          method: 'PUT',
          endpoint: `/users/${apiState.userInfo.uuid}/times`,
          data: time,
          secure: true,
        });
      },
      apiAllProjects: () => {
        if (undefined === apiState || undefined === apiState.userInfo) throw 'Not connected';

        return fetchWrapper<{ projects: string[]; }>({
          endpoint: `/users/${apiState.userInfo.uuid}/projects`,
          secure: true,
        });
      },
      apiAllTags: () => {
        if (undefined === apiState || undefined === apiState.userInfo) throw 'Not connected';

        return fetchWrapper<{ projects: string[]; }>({
          endpoint: `/users/${apiState.userInfo.uuid}/tags`,
          secure: true,
        });
      },
    },
  };
}

type FetchParams = {
  endpoint: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  // To refresh tokens if almost expired
  secure?: boolean;
  // To accept cookies from backend
  acceptCookies?: boolean;
  data?: { [key: string]: any };
};

export type FetchError = {
  error: string;
};
