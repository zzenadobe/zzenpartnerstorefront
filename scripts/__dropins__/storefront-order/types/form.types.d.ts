/********************************************************************
 * ADOBE CONFIDENTIAL
 *
 *  Copyright 2024 Adobe
 *  All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Adobe and its suppliers, if any. The intellectual
 * and technical concepts contained herein are proprietary to Adobe
 * and its suppliers and are protected by all applicable intellectual
 * property laws, including trade secret and copyright laws.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Adobe.
 *******************************************************************/
export declare enum FieldEnumList {
    BOOLEAN = "BOOLEAN",
    DATE = "DATE",
    DATETIME = "DATETIME",
    DROPDOWN = "DROPDOWN",
    FILE = "FILE",
    GALLERY = "GALLERY",
    HIDDEN = "HIDDEN",
    IMAGE = "IMAGE",
    MEDIA_IMAGE = "MEDIA_IMAGE",
    MULTILINE = "MULTILINE",
    MULTISELECT = "MULTISELECT",
    PRICE = "PRICE",
    SELECT = "SELECT",
    TEXT = "TEXT",
    TEXTAREA = "TEXTAREA",
    UNDEFINED = "UNDEFINED",
    VISUAL = "VISUAL",
    WEIGHT = "WEIGHT",
    EMPTY = ""
}
export interface FieldsProps {
    className: string;
    fieldType: FieldEnumList;
    id: string;
    code: string;
    name: string;
    defaultValue: string | boolean | number;
    entityType: string;
    required: boolean;
    isUnique: boolean;
    label: string;
    orderNumber: number;
    options?: {
        is_default?: boolean;
        label?: string;
        value?: string;
    }[];
}
export interface FormProps {
    fieldsConfig?: FieldsProps[] | [];
    name?: string;
    className?: string;
    children?: any;
    loading?: boolean;
    onSubmit?: (event: SubmitEvent, isValid: boolean) => Promise<void | null | undefined>;
}
export interface useFormProps extends Omit<FormProps, 'children' | 'className' | 'name'> {
}
export type FormValues = Record<string, string | number | boolean | undefined>;
export interface FormInputsProps {
    className?: string;
    errors?: Record<string, string>;
    values?: FormValues;
    fields?: FieldsProps[];
    loading?: boolean;
    onChange?: (event: Event) => void;
    onBlur?: (event: Event) => void;
}
//# sourceMappingURL=form.types.d.ts.map