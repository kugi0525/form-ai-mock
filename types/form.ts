export type FormCategory = 'survey' | 'campaign' | 'contact';

export interface FormField {
  label: string;
  type: 'text' | 'textarea' | 'radio' | 'checkbox' | 'select' | 'email' | 'date';
  required: boolean;
  options?: string[];
}

export interface FormSchema {
  title: string;
  description: string;
  fields: FormField[];
}
