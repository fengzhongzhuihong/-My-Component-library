import { getAuthority } from './authority';
import RenderAuthorize from './index';
/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable import/no-mutable-exports */
let AuthorizedTs = RenderAuthorize(getAuthority());

// Reload the rights component
const reloadAuthorized = (): void => {
  AuthorizedTs = RenderAuthorize(getAuthority());
};

/**
 * hard code
 * block need it。
 */
// @ts-ignore
window.reloadAuthorized = reloadAuthorized;

export { reloadAuthorized };
export default AuthorizedTs;
