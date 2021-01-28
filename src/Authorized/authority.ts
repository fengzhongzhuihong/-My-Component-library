import { parse } from 'qs';
import { reloadAuthorized } from './AuthorizedTs';

export function getPageQuery() {
  return parse(window.location.href.split('?')[1]);
}

// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority(str?: string): string | string[] {
  const authorityString =
    typeof str === 'undefined' && sessionStorage
      ? sessionStorage.getItem('zlAuthority')
      : str;
  // authorityString could be admin, "admin", ["admin"]
  let authority;
  try {
    if (authorityString) {
      authority = JSON.parse(authorityString);
    }
  } catch (e) {
    authority = authorityString;
  }
  if (typeof authority === 'string') {
    return [authority];
  }
  return authority;
}

/**
 * 设置用户权限
 * @param authority
 * @param payload 数据
 */
export function setAuthority(
  authority: string | string[],
  payload: any,
  auto?: boolean,
): void {
  const proAuthority = typeof authority === 'string' ? [authority] : authority;
  sessionStorage.setItem('zlAuthority', JSON.stringify(proAuthority));
  if (payload.jwtToken) {
    if (auto) {
      localStorage.setItem('jwtToken', payload.jwtToken);
    }
    sessionStorage.setItem('jwtToken', payload.jwtToken);
  } else {
    delete payload.jwtToken;
  }
  // 保存用户信息
  setSessionInfo(payload);
  // auto reload
  reloadAuthorized();
}

/**
 * 移除权限
 */
export function removeAuthority(payload: any) {
  const proAuthority = ['guest'];
  sessionStorage.setItem('zlAuthority', JSON.stringify(proAuthority));
  deleteSessionInfo(payload);
  localStorage.removeItem('jwtToken');
  reloadAuthorized();
}

/**
 * 保存session信息
 * @param userinfo 后台传递的用户信息
 */
export function setSessionInfo(userinfo: {}) {
  Object.keys(userinfo).forEach((key) => {
    sessionStorage.setItem(key, userinfo[key]);
  });
}

/**
 * 移除session信息
 * @param obj 需要移除的对象
 */
export function deleteSessionInfo(obj: {}) {
  Object.keys(obj).forEach((key) => {
    sessionStorage.removeItem(key);
  });
}

export default {
  getPageQuery,
  getAuthority,
  deleteSessionInfo,
  removeAuthority,
  setAuthority,
  setSessionInfo,
};
