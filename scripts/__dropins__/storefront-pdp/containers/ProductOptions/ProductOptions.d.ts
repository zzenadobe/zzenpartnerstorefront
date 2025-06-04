import { HTMLAttributes } from 'preact/compat';
import { Container, SlotProps } from '@dropins/tools/types/elsie/src/lib';
import { ProductModel } from '../../data/models';

export interface ProductOptionsProps extends HTMLAttributes<HTMLDivElement> {
    hideSelectedValue?: boolean;
    onValues?: (optionsUIDs: string[]) => void;
    onErrors?: (errors: {
        [id: string]: string;
    }) => void;
    slots?: {
        Swatches: SlotProps<{
            data: ProductModel | null;
            optionsUIDs: string[];
        }>;
    };
}
export declare const ProductOptions: Container<ProductOptionsProps, {
    data: ProductModel | null;
    optionsUIDs: string[];
}>;
//# sourceMappingURL=ProductOptions.d.ts.map