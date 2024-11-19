import { Download } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";

interface FormField {
  id: string;
  type: "text" | "select" | "radio" | "textarea";
  label: string;
  required: boolean;
  placeholder?: string;
  validation?: {
    pattern?: string;
    message?: string;
  };
  options?: { value: string; label: string }[]; // For select and radio
}

interface FormSchema {
  formTitle: string;
  formDescription: string;
  fields: FormField[];
}

interface FormGeneratorProps {
  jsonData: string; // JSON data passed as string
  isDarkMode: boolean; // Dark mode state passed from App
}

const FormGenerator: React.FC<FormGeneratorProps> = ({
  jsonData,
  isDarkMode,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues, // To get current form values
  } = useForm();
  const [formSchema, setFormSchema] = React.useState<FormSchema | null>(null);
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

  // Download the form data as JSON
  const downloadFormData = () => {
    const formData = getValues(); // Get current form values
    const jsonBlob = new Blob([JSON.stringify(formData, null, 2)], {
      type: "application/json",
    });

    // Create a link to trigger the download
    const link = document.createElement("a");
    link.href = URL.createObjectURL(jsonBlob);
    link.download = "form-data.json"; // Filename for the downloaded file
    link.click();
    URL.revokeObjectURL(link.href); // Clean up the URL object
  };

  return (
    <div
      className={`p-4 shadow-md rounded-lg m-2 ${
        isDarkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-black"
      }`}
    >
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
            {formSchema.fields.map((field: FormField) => {
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
                    className={`font-medium mb-2 capitalize ${
                      isDarkMode ? "text-white" : "text-gray-700"
                    }`}
                  >
                    {label}{" "}
                    {required && <span className="text-red-500">*</span>}
                  </label>

                  {/* Render Field Based on Type */}
                  {type === "select" && options && Array.isArray(options) ? (
                    <select
                      {...register(id, {
                        required: required ? "This field is required" : false,
                      })}
                      id={id}
                      className={`p-2 border rounded-md focus:ring focus:outline-none ${
                        isDarkMode
                          ? "bg-gray-700 text-white"
                          : "bg-white text-black"
                      }`}
                    >
                      <option value="">Select an option</option>
                      {options.map((option, idx) => (
                        <option key={idx} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : type === "select" ? (
                    <div className="text-red-500 text-sm">
                      Options are required for select fields.
                    </div>
                  ) : null}

                  {type === "radio" && options && Array.isArray(options) ? (
                    <div className="space-y-2">
                      {options.map((option, idx) => (
                        <label
                          key={idx}
                          className={`inline-flex items-center ${
                            isDarkMode ? "text-white" : "text-gray-700"
                          }`}
                        >
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
                  ) : type === "radio" ? (
                    <div className="text-red-500 text-sm">
                      Options are required for radio fields.
                    </div>
                  ) : null}

                  {type === "textarea" && (
                    <textarea
                      {...register(id, {
                        required: required ? "This field is required" : false,
                      })}
                      id={id}
                      placeholder={placeholder}
                      className={`p-2 border rounded-md focus:ring focus:outline-none ${
                        isDarkMode
                          ? "bg-gray-700 text-white"
                          : "bg-white text-black"
                      }`}
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
                                message: validation.message || "Invalid input", // Default fallback for message
                              }
                            : undefined,
                        })}
                        id={id}
                        type={type}
                        placeholder={placeholder}
                        className={`p-2 border rounded-md focus:ring focus:outline-none ${
                          isDarkMode
                            ? "bg-gray-700 text-white"
                            : "bg-white text-black"
                        }`}
                      />
                    )}

                  {/* Validation Error Message */}
                  {errors[id]?.message && (
                    <p className="text-red-500 text-sm mt-1">
                      {typeof errors[id]?.message === "string"
                        ? errors[id]?.message
                        : "Invalid input"}
                    </p>
                  )}
                </div>
              );
            })}
            <div className="flex gap-2">
              <button
                type="submit"
                className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-500 mt-4"
              >
                Submit
              </button>
              {/* Download Button */}
              <button
                onClick={downloadFormData}
                className={`mt-4 py-2 px-4 flex rounded-md ${
                  isDarkMode
                    ? "bg-green-600 text-white hover:bg-green-500"
                    : "bg-green-500 text-white hover:bg-green-400"
                }`}
              >
                <Download className="mr-2" />
                Download Form Data
              </button>
            </div>
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
