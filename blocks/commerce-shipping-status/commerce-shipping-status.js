/* eslint-disable import/no-unresolved */
/* eslint-disable import/no-extraneous-dependencies */
import { render as orderRenderer } from '@dropins/storefront-order/render.js';
import { ShippingStatus } from '@dropins/storefront-order/containers/ShippingStatus.js';
import { UPS_TRACKING_URL } from '../../scripts/constants.js';

// Initialize
import '../../scripts/initializers/order.js';

export default async function decorate(block) {
  await orderRenderer.render(ShippingStatus, {
    routeTracking: ({ carrier, number }) => {
      if (carrier?.toLowerCase() === 'ups') {
        return `${UPS_TRACKING_URL}?tracknum=${number}`;
      }
      return '';
    },
    routeProductDetails: (data) => {
      if (data?.orderItem) {
        return `/products/${data?.orderItem?.productUrlKey}/${data?.orderItem?.product?.sku}`;
      }
      if (data?.product) {
        return `/products/${data?.product?.urlKey}/${data?.product?.sku}`;
      }
      return '#';
    },
  })(block);
}
