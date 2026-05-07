export const FieldType = Object.freeze({
  TEXT: "text",
  NUMBER: "number",
  EMAIL: "email",
  PASSWORD: "password",
  SELECT: "select",
  MULTISELECT: "multiSelect",
  RICHTEXT: "richText",
  MULTIFILE: "multifile",
  FILE: "file",
  PHONE_NUMBER: "phone_number",
  CHECKBOX: "checkbox",
  RADIO: "radio",
});

export const ModeType = Object.freeze({
  CUSTOM: "custom",
  ADD: "add",
  EDIT: "edit",
});

// export const FieldConfig = {
//   name: string,
//   label: string,
//   type: FieldType,
//   options: { value: string | boolean, label: string },
//   validation: z.ZodTypeAny,
//   placeholder: string,
//   required: boolean,
//   countryAndMobileCodeRef: string,
//   rows: number,
// }
