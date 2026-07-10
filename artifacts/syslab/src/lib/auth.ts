import { setAuthTokenGetter } from '@workspace/api-client-react';

export function setupAuth() {
  setAuthTokenGetter(() => localStorage.getItem('syslab_token'));
}
