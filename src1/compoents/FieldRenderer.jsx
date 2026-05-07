import { FieldAttributeType } from "../constants/FieldAttributeType";
import { Badge } from "./Badge";

export const titleClasses = "text-dark dark:text-gray-100";

export function FieldRenderer({
  config,
  product,
  className = "",
  hasNew = false,
}) {
  const { key, label, type, render } = config;
  const value = product[key];
  const labelClasses =
    "mb-1 text-sm font-medium text-light-gray/90 dark:text-gray-400";

  if (value === undefined || value === null) {
    return null;
  }

  if (
    type === FieldAttributeType.IMAGE &&
    (!Array.isArray(value) || value.length === 0)
  ) {
    return null;
  }

  if (
    type === FieldAttributeType.PRICE &&
    (!Array.isArray(value) || value.length === 0)
  ) {
    return null;
  }

  if (render) {
    return (
      <div className={`mb-4 ${className}`}>
        <h3 className={`${labelClasses}`}>{label}</h3>
        <div className={`${titleClasses}`}>{render(value, product)}</div>
      </div>
    );
  }

  switch (type) {
    case FieldAttributeType.TEXT:
      return (
        <div className={`mb-4 ${className}`}>
          <h3 className={`${labelClasses}`}>{label}</h3>
          <p className={`${titleClasses}`}>
            {value || (hasNew ? "No Update" : "N/A")}
          </p>
        </div>
      );

    case FieldAttributeType.LONGTEXT:
      return (
        <div className={`mb-4 ${className}`}>
          <h3 className={`${labelClasses}`}>{label}</h3>
          <div className={`whitespace-pre-line ${titleClasses}`}>
            {value || (hasNew ? "No Update" : "N/A")}
          </div>
        </div>
      );

    case FieldAttributeType.NUMBER:
      return (
        <div className={`mb-4 ${className}`}>
          <h3 className={`${labelClasses}`}>{label}</h3>
          <p className={`${titleClasses}`}>
            {value !== undefined ? value : hasNew ? "No Update" : "N/A"}
          </p>
        </div>
      );

    case FieldAttributeType.BOOLEAN:
      return (
        <div className={`mb-4 ${className}`}>
          <h3 className={`${labelClasses}`}>{label}</h3>
          <Badge variant={value ? "success" : "error"}>
            {value ? "Yes" : "No"}
          </Badge>
        </div>
      );

    case FieldAttributeType.ARRAY:
      return (
        <div className={`mb-4 ${className}`}>
          <h3 className={`${labelClasses}`}>{label}</h3>
          {Array.isArray(value) && value.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {value.map((item, index) => (
                <Badge key={index} variant="default">
                  {typeof item === "object"
                    ? JSON.stringify(item)
                    : String(item)}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No items</p>
          )}
        </div>
      );

    case FieldAttributeType.STATUS:
      return (
        <div className={`mb-4 ${className}`}>
          <h3 className={`${labelClasses}`}>{label}</h3>
          <Badge variant={value ? "success" : "error"}>
            {value ? "Active" : "Inactive"}
          </Badge>
        </div>
      );

    default:
      return (
        <div className={`mb-4 ${className}`}>
          <h3 className={`${labelClasses}`}>{label}</h3>
          <p className={`${titleClasses}`}>
            {typeof value === "object"
              ? JSON.stringify(value)
              : String(value || (hasNew ? "No Update" : "N/A"))}
          </p>
        </div>
      );
  }
}
