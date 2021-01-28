import RenderAuthorize from './index';

/**
 * 泽羚专用权限组件
 */
const ZlAuthorized = RenderAuthorize(
  JSON.parse(sessionStorage.getItem('zlAuthority')!),
);

export default ZlAuthorized;
