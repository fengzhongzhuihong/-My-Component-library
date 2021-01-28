import AuthorizedTsx from './AuthorizedTsx';
import AuthorizedRoute from './AuthorizedRoute';
import Secured from './Secured';
import check from './CheckPermissions';
import renderAuthorize from './renderAuthorize';

AuthorizedTsx.Secured = Secured;
AuthorizedTsx.AuthorizedRoute = AuthorizedRoute;
AuthorizedTsx.check = check;

const RenderAuthorize: any = renderAuthorize(AuthorizedTsx);

export default RenderAuthorize;
