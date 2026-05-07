import React from "react";
import { FieldRenderer } from "./FieldRenderer";
import { FieldAttributeType } from "../constants/FieldAttributeType";
import { Card, CardContent, CardHeader } from "./card";

const ViewRoleDetails = ({
  title,
  titleClassName = "",
  className = "",
  fields = [],
  data = {},
}) => {
  return (
    <Card className={`mb-6 ${className}`}>
      <CardHeader>
        <h2 className={`text-lg font-semibold ${titleClassName}`}>{title}</h2>  
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {fields.map((field) => (
            <FieldRenderer
              key={field.key}
              config={field}
              product={data}
              className={
                field.type === FieldAttributeType.IMAGE ||
                field.type === FieldAttributeType.LONGTEXT
                  ? "md:col-span-2"
                  : ""
              }
            />
          ))}
        </div>
      </CardContent>
    </Card> 
  );
};

export default ViewRoleDetails;
