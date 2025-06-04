import { Region, Country, CustomAttribute } from '.';

export interface Address {
    id?: number;
    city: string;
    company?: string;
    country: Country;
    customAttributes: CustomAttribute[];
    firstName: string;
    lastName: string;
    postCode?: string;
    region?: Region;
    street: string[];
    telephone?: string;
    vatId?: string;
    prefix?: string;
    suffix?: string;
    middleName?: string;
    fax?: string;
}
//# sourceMappingURL=address.d.ts.map