import React from "react";
import { useForm } from "react-hook-form";

interface FormGeneratorProps {
  jsonData: string; // JSON data passed as string
}

const FormGenerator: React.FC<FormGeneratorProps> = ({ jsonData }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [formSchema, setFormSchema] = React.useState<any>(null);
  const [error, setError] = React.useState<string | null>(null);

  // Parse the JSON and dynamically generate form fields
  React.useEffect(() => {
    if (!jsonData) {
      setError("No JSON data provided.");
      setFormSchema(null);
      return;
    }

    try {
      const parsedData = JSON.parse(jsonData); // Parse the JSON data

      if (!parsedData.fields || !Array.isArray(parsedData.fields)) {
        setError("Invalid JSON format: Missing or incorrect 'fields' array.");
        setFormSchema(null);
      } else {
        setFormSchema(parsedData); // Set the parsed schema
        setError(null); // Clear any previous errors
      }
    } catch (error) {
      console.error("Invalid JSON input:", error);
      setError("Invalid JSON input.");
      setFormSchema(null);
    }
  }, [jsonData]);

  // Handle form submission
  const onSubmit = (data: any) => {
    console.log("Form Data Submitted:", data);
  };

  return (
    <div className="bg-gray-100 p-4 rounded shadow-md">
      {error ? (
        <div className="text-red-500 text-center">{error}</div>
      ) : formSchema ? (
        <>
          {/* Form Title and Description */}
          <h1 className="font-bold text-2xl mb-4 text-center">
            {formSchema.formTitle}
          </h1>
          <p className="text-gray-600 text-center mb-6">
            {formSchema.formDescription}
          </p>

          {/* Render Form Fields */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {formSchema.fields.map((field: any) => {
              const {
                id,
                type,
                label,
                required,
                placeholder,
                validation,
                options,
              } = field;

              return (
                <div key={id} className="flex flex-col">
                  <label
                    htmlFor={id}
                    className="text-gray-700 font-medium mb-2 capitalize"
                  >
                    {label}{" "}
                    {required && <span className="text-red-500">*</span>}
                  </label>

                  {/* Render Field Based on Type */}
                  {type === "select" && (
                    <select
                      {...register(id, {
                        required: required ? "This field is required" : false,
                      })}
                      id={id}
                      className="p-2 border rounded-md focus:ring focus:outline-none"
                    >
                      <option value="">Select an option</option>
                      {options.map((option: any, idx: number) => (
                        <option key={idx} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  )}

                  {type === "radio" && (
                    <div className="space-y-2">
                      {options.map((option: any, idx: number) => (
                        <label key={idx} className="inline-flex items-center">
                          <input
                            type="radio"
                            {...register(id, {
                              required: required
                                ? "This field is required"
                                : false,
                            })}
                            value={option.value}
                            className="mr-2"
                          />
                          {option.label}
                        </label>
                      ))}
                    </div>
                  )}

                  {type === "textarea" && (
                    <textarea
                      {...register(id, {
                        required: required ? "This field is required" : false,
                      })}
                      id={id}
                      placeholder={placeholder}
                      className="p-2 border rounded-md focus:ring focus:outline-none"
                    />
                  )}

                  {type !== "select" &&
                    type !== "radio" &&
                    type !== "textarea" && (
                      <input
                        {...register(id, {
                          required: required ? "This field is required" : false,
                          pattern: validation?.pattern
                            ? {
                                value: new RegExp(validation.pattern),
                                message: validation.message,
                              }
                            : undefined,
                        })}
                        id={id}
                        type={type}
                        placeholder={placeholder}
                        className="p-2 border rounded-md focus:ring focus:outline-none"
                      />
                    )}

                  {/* Validation Error Message */}
                  {errors[id]?.message && (
                    <p className="text-red-500 text-sm mt-1">
                      {typeof errors[id]?.message === "string"
                        ? errors[id].message
                        : "Invalid input"}
                    </p>
                  )}
                </div>
              );
            })}
            <button
              type="submit"
              className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-500"
            >
              Submit
            </button>
          </form>
        </>
      ) : (
        <p className="text-gray-500 text-center">
          No valid form schema provided.
        </p>
      )}
    </div>
  );
};

export default FormGenerator;
