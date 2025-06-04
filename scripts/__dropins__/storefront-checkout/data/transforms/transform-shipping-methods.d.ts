import { GetCartQuery } from '../../__generated__/types';
import { ShippingMethod } from '../models/shipping-method';

type Cart = NonNullable<GetCartQuery['cart']>;
type ShippingAddresses = Cart['shipping_addresses'];
type ShippingAddress = NonNullable<NonNullable<ShippingAddresses>[number]>;
type AvailableShippingMethods = ShippingAddress['available_shipping_methods'];
type AvailableShippingMethod = NonNullable<AvailableShippingMethods>[number];
type SelectedShippingMethod = ShippingAddress['selected_shipping_method'];
export declare const transformSelectedShippingMethod: (data: SelectedShippingMethod) => ShippingMethod | undefined;
export declare const transformAvailableShippingMethod: (data: AvailableShippingMethod) => ShippingMethod | undefined;
export declare const transformShippingMethods: (data: AvailableShippingMethods) => ShippingMethod[] | undefined;
export {};
//# sourceMappingURL=transform-shipping-methods.d.ts.map