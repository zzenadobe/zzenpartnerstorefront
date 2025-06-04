/* eslint-disable import/no-unresolved */
/* eslint-disable import/no-extraneous-dependencies */
import { Addresses } from '@dropins/storefront-account/containers/Addresses.js';
import { render as accountRenderer } from '@dropins/storefront-account/render.js';
import { readBlockConfig } from '../../scripts/aem.js';
import { checkIsAuthenticated } from '../../scripts/configs.js';
import { CUSTOMER_ADDRESS_PATH, CUSTOMER_LOGIN_PATH } from '../../scripts/constants.js';

// Initialize
import '../../scripts/initializers/account.js';

export default async function decorate(block) {
  const {
    'minified-view': minifiedViewConfig = 'false',
  } = readBlockConfig(block);

  if (!checkIsAuthenticated()) {
    window.location.href = CUSTOMER_LOGIN_PATH;
  } else {
    await accountRenderer.render(Addresses, {
      minifiedView: minifiedViewConfig === 'true',
      withActionsInMinifiedView: false,
      withActionsInFullSizeView: true,
      routeAddressesPage: () => CUSTOMER_ADDRESS_PATH,
    })(block);
  }
}
