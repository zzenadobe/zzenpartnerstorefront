import { FunctionComponent } from 'preact';

export interface PaginationProps {
    className?: string;
    currentPage?: number;
    totalPages?: number;
    onChange?: (currentPage: number) => void;
}
export type PaginationList = {
    page: number | string;
    isActive: boolean;
    label: number | string;
};
export declare const Pagination: FunctionComponent<PaginationProps>;
//# sourceMappingURL=Pagination.d.ts.map