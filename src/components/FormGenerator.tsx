import React, { useState, useEffect } from "react";

interface FormGeneratorProps {
  jsonData: string; // JSON data as a string
}

const FormGenerator: React.FC<FormGeneratorProps> = ({ jsonData }) => {
  const [formFields, setFormFields] = useState<any>({});
  const [formData, setFormData] = useState<any>({}); // Tracks user input

  // Parse JSON data when jsonData changes
  useEffect(() => {
    try {
      const parsedData = JSON.parse(jsonData); // Parse the JSON data
      setFormFields(parsedData);
      setFormData(() =>
        Object.keys(parsedData).reduce(
          (acc, key) => ({ ...acc, [key]: parsedData[key]?.value || "" }),
          {}
        )
      );
    } catch (error) {
      console.error("Invalid JSON input:", error);
      setFormFields({});
      setFormData({});
    }
  }, [jsonData]);

  // Handle form input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev: typeof formData) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Render the form dynamically
  return (
    <div className="bg-gray-100 p-4 rounded shadow-md">
      <h1 className="font-bold text-2xl mb-4 text-center ">Generated Form</h1>
      {Object.keys(formFields).length > 0 ? (
        <form className="space-y-4">
          {Object.entries(formFields).map(([key, fieldConfig]: any) => {
            const { type = "text", value = "", options = [] } = fieldConfig;

            return (
              <div key={key} className="flex flex-col">
                <label className="text-gray-700 font-medium mb-2 capitalize">
                  {key}
                </label>

                {type === "select" ? (
                  <select
                    name={key}
                    value={formData[key] || ""}
                    onChange={handleChange}
                    className="p-2 border rounded-md focus:ring focus:outline-none"
                  >
                    {options.map((option: string, idx: number) => (
                      <option key={idx} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={type}
                    name={key}
                    value={formData[key] || ""}
                    onChange={handleChange}
                    className="p-2 border rounded-md focus:ring focus:outline-none"
                  />
                )}
              </div>
            );
          })}
          <button
            type="button"
            onClick={() => console.log("Form Data Submitted:", formData)}
            className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-500"
          >
            Submit
          </button>
        </form>
      ) : (
        <p className="text-gray-500">No valid JSON data provided.</p>
      )}
    </div>
  );
};

export default FormGenerator;
