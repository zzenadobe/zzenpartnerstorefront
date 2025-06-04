/* eslint-disable import/no-unresolved */
/* eslint-disable import/no-extraneous-dependencies */
import { render as orderRenderer } from '@dropins/storefront-order/render.js';
import ReturnsList from '@dropins/storefront-order/containers/ReturnsList.js';
import { readBlockConfig } from '../../scripts/aem.js';
import { checkIsAuthenticated } from '../../scripts/configs.js';
import {
  CUSTOMER_LOGIN_PATH,
  CUSTOMER_RETURN_DETAILS_PATH,
  CUSTOMER_ORDER_DETAILS_PATH,
  CUSTOMER_RETURNS_PATH,
  UPS_TRACKING_URL,
} from '../../scripts/constants.js';

// Initialize
import '../../scripts/initializers/order.js';

export default async function decorate(block) {
  const {
    'minified-view': minifiedViewConfig = 'false',
  } = readBlockConfig(block);

  if (!checkIsAuthenticated()) {
    window.location.href = CUSTOMER_LOGIN_PATH;
  } else {
    await orderRenderer.render(ReturnsList, {
      minifiedView: minifiedViewConfig === 'true',
      routeTracking: ({ carrier, number }) => {
        if (carrier?.toLowerCase() === 'ups') {
          return `${UPS_TRACKING_URL}?tracknum=${number}`;
        }
        return '';
      },
      routeReturnDetails: ({ orderNumber, returnNumber }) => `${CUSTOMER_RETURN_DETAILS_PATH}?orderRef=${orderNumber}&returnRef=${returnNumber}`,
      routeOrderDetails: ({ orderNumber }) => `${CUSTOMER_ORDER_DETAILS_PATH}?orderRef=${orderNumber}`,
      routeReturnsList: () => CUSTOMER_RETURNS_PATH,
      routeProductDetails: (productData) => (productData?.product ? `/products/${productData.product.urlKey}/${productData.product.sku}` : '#'),
    })(block);
  }
}
