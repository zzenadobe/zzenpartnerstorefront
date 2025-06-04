import { ShippingMethod } from '../../data/models';
import { SlotProps } from '@dropins/tools/types/elsie/src/lib';
import { HTMLAttributes } from 'preact/compat';

export interface ShippingMethodsProps extends HTMLAttributes<HTMLDivElement> {
    onShippingMethodSelect?: (method: ShippingMethod) => void;
    preSelectedMethod?: {
        carrierCode: string;
        methodCode: string;
    };
    shippingMethodsSlot?: SlotProps;
}
export declare const ShippingMethods: {
    ({ hideOnEmptyCart, hideOnVirtualCart, ...props }: import('../../hocs/withConditionalRendering').ConditionalProps & ShippingMethodsProps): import("preact/compat").JSX.Element;
    displayName: string;
};
//# sourceMappingURL=ShippingMethods.d.ts.map