import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "../Button";
import * as z from "zod";
import Dropzone, { DropzoneFiles, SingleFileUpload } from "./Dropzone";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import { PasswordField } from "./PasswordField";
import PhoneInput from "./PhoneInput";
import { FieldType, ModeType } from "../../constants/formConstants";
import { VariantType } from "../../constants/btnVariantType";

const defaultInitialValue = {};

const Form = ({
  fields,
  onSubmit,
  onReset,
  onEdit,
  mode,
  initialValues = defaultInitialValue,
  showButtons = { add: true, edit: true, reset: true, custom: false },
  className,
  CustomButton,
  validationSchema,
  isEditingDisable = false,
  isEditingCancel = false,
}) => {
  const [files, setFiles] = useState({});

  const schema = useMemo(
    () =>
      z.object(
        fields.reduce((acc, field) => {
          if (field.validation) {
            acc[field.name] = field.validation;
          } else {
            switch (field.type) {
              case FieldType.TEXT:
              case FieldType.RICHTEXT:
                acc[field.name] = z
                  .string()
                  .min(1, `${field.label} is required`);
                break;
              case FieldType.NUMBER:
                acc[field.name] = z
                  .number()
                  .min(0, `${field.label} must be a positive number`);
                break;
              case FieldType.SELECT:
                acc[field.name] = z.object({
                  value: z.string(),
                  label: z.string(),
                });
                break;
              case FieldType.MULTISELECT:
                acc[field.name] = z
                  .array(z.object({ value: z.string(), label: z.string() }))
                  .min(1, `At least one ${field.label} is required`);
                break;
              case FieldType.FILE:
                acc[field.name] = z.any().optional();
                break;
              case FieldType.MULTIFILE:
                acc[field.name] = z.any().optional();
                break;
            }
          }
          return acc;
        }, {})
      ),
    [fields]
  );

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
    getValues,
  } = useForm({
    defaultValues: initialValues,
    resolver: zodResolver(validationSchema ?? schema),
  });

  useEffect(() => {
    reset(initialValues);
    setFiles({});
  }, [fields, initialValues]);

  useEffect(() => {
    if (isEditingCancel) {
      reset(initialValues);
    }
  }, [isEditingCancel]);

  const handleOnMultiFileUpate = useCallback(
    (name, acceptedFiles) => {
      const updatedFiles = [...(files[name] || []), ...acceptedFiles];
      setFiles((prevFiles) => ({
        ...prevFiles,
        [name]: updatedFiles,
      }));
      setValue(name, updatedFiles, { shouldValidate: true });
    },
    [files]
  );

  const handleOnSingleFileUpdate = useCallback((name, acceptedFile) => {
    setValue(name, acceptedFile, { shouldValidate: true });
  }, []);

  const removeSingleFile = useCallback((name) => {
    setValue(name, [], { shouldValidate: true });
  }, []);

  const removeFile = useCallback(
    (name, index) => {
      const updatedFiles = files[name].filter((_, i) => i !== index);
      setFiles((prevFiles) => ({
        ...prevFiles,
        [name]: updatedFiles,
      }));
      setValue(name, updatedFiles, { shouldValidate: true });
    },
    [files]
  );

  const handleReset = () => {
    reset();
    if (onReset) onReset();
  };

  const handleOnSubmit = async (data) => {
    if (mode === ModeType.ADD || mode === ModeType.CUSTOM) {
      const hasSubmitted = await onSubmit(data);
      if (hasSubmitted) reset();
    } else if (mode === ModeType.EDIT && onEdit) {
      onEdit(data);
    }
  };

  const renderField = useCallback(
    (field) => {
      switch (field.type) {
        case FieldType.MULTISELECT:
          return (
            <Controller
              name={field.name}
              control={control}
              render={({ field: { onChange, value } }) => {
                return (
                  <Select
                    isMulti={true}
                    required={field.required}
                    options={field.options}
                    value={value}
                    onChange={onChange}
                    placeholder={field.placeholder}
                    className="mt-1"
                    isDisabled={isEditingDisable}
                    theme={(theme) => ({
                      ...theme,
                      borderRadius: 6,
                      colors: { ...theme.colors, primary: "#0275ff" },
                    })}
                  />
                );
              }}
            />
          );
        case FieldType.SELECT:
          return (
            <Controller
              name={field.name}
              control={control}
              render={({ field: { onChange, value } }) => (
                <Select
                  options={field.options}
                  required={field.required}
                  value={value}
                  onChange={onChange}
                  placeholder={field.placeholder}
                  className="mt-1"
                  isDisabled={isEditingDisable}
                  theme={(theme) => ({
                    ...theme,
                    borderRadius: 6,
                    colors: { ...theme.colors, primary: "#0275ff" },
                  })}
                />
              )}
            />
          );
        case FieldType.NUMBER:
          return (
            <input
              id={field.name}
              required={field.required}
              type="number"
              {...register(field.name, { valueAsNumber: true })}
              placeholder={field.placeholder}
              disabled={isEditingDisable}
              className={`mt-0 block w-full rounded-md border border-solid border-gray-300 px-3 py-2.5 tracking-wide text-gray-800 outline-none transition-all duration-200 ${
                errors[field.name]
                  ? "border-red-500"
                  : "focus:ring-2 focus:ring-blue-500"
              }`}
            />
          );
        case FieldType.TEXT:
          return (
            <input
              id={field.name}
              {...register(field.name)}
              placeholder={field.placeholder}
              required={field.required}
              disabled={isEditingDisable}
              className={`mt-0 block w-full rounded-md border border-solid border-gray-sm px-3 py-2.5 tracking-wide text-dark outline-none transition-all duration-200 ${
                errors[field.name]
                  ? "border-red-500"
                  : "focus:ring-2 focus:ring-blue-primary"
              }`}
            />
          );
        case FieldType.RICHTEXT:
          return (
            <textarea
              id={field.name}
              {...register(field.name)}
              placeholder={field.placeholder}
              rows={field.rows ?? 5}
              required={field.required}
              disabled={isEditingDisable}
              className={`mt-0 block w-full rounded-md border border-solid border-gray-300 px-3 py-1.5 text-gray-800 outline-none transition-all duration-200 ${
                errors[field.name]
                  ? "border-red-500"
                  : "focus:ring-2 focus:ring-blue-500"
              }`}
            ></textarea>
          );
        case FieldType.MULTIFILE:
          return (
            <>
              <Dropzone
                name={field.name}
                onFilesUpdate={handleOnMultiFileUpate}
                title={field.placeholder}
                isEditingDisable={isEditingDisable}
              />
              <DropzoneFiles
                files={
                  files[field.name] !== undefined
                    ? files[field.name]
                    : getValues(field.name)
                }
                removeFile={removeFile}
                fieldName={field.name}
                isEditingDisable={isEditingDisable}
              />
            </>
          );
        case FieldType.FILE:
          return (
            <SingleFileUpload
              name={field.name}
              title={field.placeholder}
              onFilesUpdate={handleOnSingleFileUpdate}
              onRemoveFile={removeSingleFile}
              isEditingDisable={isEditingDisable}
              fileValue={getValues(field.name)}
            />
          );
        case FieldType.PASSWORD:
          return (
            <PasswordField
              id={field.name}
              placeholder={field.placeholder}
              className={`mt-1 block w-full rounded-md border border-solid border-gray-300 !py-2.5 px-3 text-gray-800 outline-none transition-all duration-200 ${
                errors[field.name]
                  ? "border-red-500"
                  : "focus:ring-2 focus:ring-blue-500"
              }`}
              register={register}
              fieldName={field.name}
              required={field.required}
              isEditingDisable={isEditingDisable}
            />
          );
        case FieldType.PHONE_NUMBER:
          return (
            <PhoneInput
              countryAndMobileNumberRef={field?.countryAndMobileCodeRef}
              required={field.required}
              id={field.name}
              placeholder={field.placeholder}
              register={register}
              fieldName={field.name}
              isEditingDisable={isEditingDisable}
              className={`${
                errors[field.name]
                  ? "!border-red-500"
                  : "dark:focus:ring-blue-primary"
              }`}
            />
          );
        default:
          return (
            <input
              id={field.name}
              type={field.type}
              {...register(field.name)}
              placeholder={field.placeholder}
              required={field.required}
              disabled={isEditingDisable}
              className={`mt-1 block w-full rounded-md border border-solid border-gray-300 px-3 py-2.5 text-gray-800 outline-none transition-all duration-200 ${
                errors[field.name]
                  ? "border-red-500"
                  : "focus:ring-2 focus:ring-blue-500"
              }`}
            />
          );
      }
    },
    [fields, files, isEditingCancel, isEditingDisable, initialValues]
  );

  return (
    <form
      onSubmit={handleSubmit(handleOnSubmit)}
      className={`w-full rounded-md bg-white px-4 py-8 text-sm shadow-lg text-gray-800 ${className}`}
    >
      <div className="grid grid-cols-1 gap-6">
        {fields.map((field) => (
          <div className="space-y-1" key={field.name}>
            <div className="space-y-2" key={field.name}>
              <label
                className={`font-medium text-gray-600`}
                htmlFor={field.name}
              >
                {field.label}
              </label>
              {renderField(field)}
            </div>
            {errors[field.name] && (
              <p className="text-red-500">{errors[field.name]?.message}</p>
            )}
          </div>
        ))}
      </div>
      <div className="mt-6 flex space-x-4">
        {showButtons.add && mode === ModeType.ADD && (
          <Button type="submit" variant={VariantType.BLUE}>
            Add
          </Button>
        )}
        {showButtons.edit && mode === ModeType.EDIT && (
          <Button type="submit" variant={VariantType.GREEN}>
            Edit
          </Button>
        )}
        {showButtons.reset && (
          <Button onClick={handleReset} variant={VariantType.GRAY}>
            Reset
          </Button>
        )}
        {mode === ModeType.CUSTOM && showButtons.custom && CustomButton}
      </div>
    </form>
  );
};

export default React.memo(Form, (prevProps, nextProps) => {
  return (
    JSON.stringify(prevProps.fields) === JSON.stringify(nextProps.fields) &&
    JSON.stringify(prevProps.initialValues) ===
      JSON.stringify(nextProps.initialValues) &&
    prevProps.mode === nextProps.mode &&
    prevProps.isEditingDisable === nextProps.isEditingDisable &&
    prevProps.isEditingCancel === nextProps.isEditingCancel &&
    JSON.stringify(prevProps.showButtons) ===
      JSON.stringify(nextProps.showButtons) &&
    prevProps.CustomButton === nextProps.CustomButton
  );
});
