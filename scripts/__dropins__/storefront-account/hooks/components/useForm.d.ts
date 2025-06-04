import { useFormProps } from '../../types';

export declare const useForm: ({ fieldsConfig, onSubmit, onChange, setInputChange, formName, isWaitingForResponse, }: useFormProps) => {
    isDataValid: boolean;
    formData: Record<string, string | number>;
    errors: Record<string, string>;
    formRef: import('preact').RefObject<HTMLFormElement>;
    handleInputChange: (event: Event, errorsProp?: Record<string, string>) => void;
    onFocus: (event: Event) => void;
    handleBlur: (event: Event, errorsProp?: Record<string, string>) => void;
    handleSubmit: (event: SubmitEvent) => void;
    handleValidationSubmit: (disableShowError?: boolean) => boolean;
};
//# sourceMappingURL=useForm.d.ts.map