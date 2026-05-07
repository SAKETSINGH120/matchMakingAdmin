import React, { useState } from "react";
import Form from "../../compoents/form-manager";
import * as z from "zod";
import { FieldType, ModeType } from "../../constants/formConstants";
import { VariantType } from "../../constants/btnVariantType";
import { Button } from "../../compoents/Button";

const fieldConfig = [
  {
    name: "title",
    label: "Blog Title",
    required: true,
    type: FieldType.TEXT,
    validation: z
      .string()
      .transform((val) => val.trim())
      .refine((val) => val.length >= 3, {
        message: "Blog title must be at least 3 characters long.",
      }),
    placeholder: "Enter blog title",
  },
  {
    name: "content",
    label: "Content",
    placeholder: "Blog content",
    required: true,
    type: FieldType.RICHTEXT,
    validation: z
      .string()
      .transform((val) => val.trim())
      .refine((val) => val.length >= 10, {
        message: "Content must be at least 10 characters long",
      }),
  },
  {
    name: "author_name",
    label: "Author Name",
    type: FieldType.TEXT,
    required: true,
    validation: z
      .string()
      .transform((val) => val.trim())
      .refine((val) => val.length >= 2, {
        message: "Author name must be at least 2 characters",
      }),
    placeholder: "Enter author name",
  },
  {
    name: "image",
    label: "Upload a blog image",
    required: true,
    type: FieldType.FILE,
    validation: z.array(z.instanceof(File)).length(1, {
      message: "Please upload a blog image",
    }),
  },
];

const Test = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = (data) => {
    setIsSubmitting(true);
    console.log(data);
    setTimeout(() => {
      setIsSubmitting(false);
    }, 2000);
  };
  return (
    <div>
      <Form
        fields={fieldConfig}
        onSubmit={handleSubmit}
        mode={ModeType.CUSTOM}
        initialValues={{}}
        showButtons={{ add: false, edit: false, reset: false, custom: true }}
        className="!rounded-none !shadow-none"
        CustomButton={
          <Button
            variant={VariantType.BLUE}
            className="ml-auto !shadow-none"
            loadingText="Saving..."
            isLoading={isSubmitting}
          >
            Add Blog
          </Button>
        }
      />
    </div>
  );
};

export default Test;
