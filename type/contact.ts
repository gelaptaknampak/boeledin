export interface ContactFormAcf {
  form_title?: string;
  form_description?: string;

  full_name_label?: string;
  full_name_placeholder?: string;
  full_name_required?: boolean;

  company_label?: string;
  company_placeholder?: string;

  email_label?: string;
  email_placeholder?: string;
  email_required?: boolean;

  phone_label?: string;
  phone_placeholder?: string;

  interest_label?: string;
  interest_placeholder?: string;

  interest_1_label?: string;
  interest_1_value?: string;

  interest_2_label?: string;
  interest_2_value?: string;

  interest_3_label?: string;
  interest_3_value?: string;

  interest_4_label?: string;
  interest_4_value?: string;

  interest_5_label?: string;
  interest_5_value?: string;

  message_label?: string;
  message_placeholder?: string;
  message_required?: boolean;

  submit_text?: string;
  success_message?: string;
  error_message?: string;
}
