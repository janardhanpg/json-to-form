import { Check, Clipboard, Download } from "lucide-react"; // Import the Download icon from lucide-react
import { highlight, languages } from "prismjs";
import "prismjs/components/prism-json";
import "prismjs/themes/prism.css";
import { useEffect, useRef, useState } from "react";
import Editor from "react-simple-code-editor";

interface JsonInputProps {
  onInputChange: (data: string) => void; // Callback prop to pass JSON data
  isDarkMode: boolean; // Dark mode state passed from App
}

const JsonInput = ({ onInputChange, isDarkMode }: JsonInputProps) => {
  const [jsonInput, setJsonInput] = useState<string>(""); // State to store JSON input
  const [error, setError] = useState<string | null>(null); // State to store errors
  const editorRef = useRef<HTMLDivElement>(null); // Ref for syncing scroll
  const [copySuccess, setCopySuccess] = useState<string | null>(null); // State for copy success message
  const [lineNumbers, setLineNumbers] = useState<string[]>([]); // State to store line numbers

  // Define the placeholder JSON object
  const placeholderJson = {
    formTitle: "Project Requirements Survey",
    formDescription: "Please fill out this survey about your project needs",
    fields: [
      {
        id: "name",
        type: "text",
        label: "Full Name",
        required: true,
        placeholder: "Enter your full name",
      },
    ],
  };

  // Convert the placeholder JSON to a pretty-printed string
  const placeholderString = JSON.stringify(placeholderJson, null, 2);

  // Handle input change and validate JSON
  const handleInputChange = (value: string) => {
    setJsonInput(value);
    onInputChange(value);
    try {
      JSON.parse(value); // Validate JSON
      setError(null); // Clear errors if valid
    } catch (e) {
      setError((e as Error).message); // Capture and store error message
    }
  };

  // Prettify JSON when button is clicked
  const prettifyJson = () => {
    try {
      const parsedJson = JSON.parse(jsonInput);
      const prettyJson = JSON.stringify(parsedJson, null, 2); // Prettify with 2 spaces indentation

      setJsonInput(prettyJson); // Update the state with prettified JSON
    } catch (e) {
      setError("Invalid JSON, cannot prettify.");
    }
  };

  // Split the input text into lines
  const lines = jsonInput.split("\n");

  // Update line numbers whenever the input text changes
  useEffect(() => {
    setLineNumbers(
      Array.from({ length: lines.length }, (_, index) => `${index + 1}`)
    );
  }, [jsonInput]);

  // Download JSON functionality
  const downloadJson = () => {
    const blob = new Blob([jsonInput], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "formatted-json.json"; // Filename for the downloaded JSON
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url); // Clean up the URL object
  };

  // Copy JSON to clipboard functionality
  const copyJsonToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(jsonInput);
      setCopySuccess("JSON copied to clipboard!");
      setTimeout(() => setCopySuccess(null), 2000); // Clear success message after 2 seconds
    } catch (err) {
      setCopySuccess("Failed to copy JSON.");
    }
  };

  return (
    <div
      className={`flex w-full h-screen flex-row ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}
    >
      <div
        className={`flex-1 p-4 rounded-lg m-2 flex flex-col ${isDarkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"}`}
      >
        <h1 className="text-center text-2xl font-bold mb-4">JSON Input Tab</h1>
        <div className="flex-1 overflow-hidden flex">
          {/* Editor with Line Numbers inside */}
          <div
            ref={editorRef}
            className={`h-full w-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 rounded-lg flex ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            }`}
            style={{
              scrollbarWidth: "thin", // Firefox scrollbar styling
              scrollbarColor: "#4B5563 #2D3748", // Thumb and track color for Firefox
            }}
          >
            {/* Line numbers */}
            <div className={`text-gray-400 mr-2 pt-2 font-mono whitespace-nowrap ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
              {lineNumbers.map((line, index) => (
                <div key={index}>{line}</div>
              ))}
            </div>

            {/* Code Editor */}
            <div className="flex-1">
              <Editor
                value={jsonInput}
                onValueChange={handleInputChange}
                highlight={(code) => highlight(code, languages.json, "json")}
                padding={10}
                className={`w-full ${isDarkMode ? "bg-gray-800 text-gray-100" : "bg-gray-50 text-gray-900"} border-none focus:outline-none resize-none`}
                placeholder="//copy the below json schema to get started"
              />
            </div>
          </div>
        </div>
        {jsonInput === "" && (
          // Show placeholder when jsonInput is empty
          <div className={`bg-gray-800 text-gray-400 p-4 border border-gray-500 mt-2 ${isDarkMode ? "bg-gray-800 text-gray-400" : "bg-gray-100 text-gray-600"}`}>
            <pre className="whitespace-pre-wrap">{placeholderString}</pre>
          </div>
        )}

        {/* Buttons and Error Log */}
        <div className="mt-auto flex flex-col-reverse">
          {/* Buttons */}
          <div className="flex space-x-2 mt-2">
            {/* Prettify Button */}
            <button
              onClick={prettifyJson}
              className={`py-2 px-4 rounded-md ${isDarkMode ? "bg-blue-600 hover:bg-blue-500" : "bg-blue-500 hover:bg-blue-400"} text-white`}
            >
              Prettify JSON
            </button>

            {/* Download JSON Button */}
            <button
              onClick={downloadJson}
              className={`py-2 px-4 rounded-md ${isDarkMode ? "bg-green-600 hover:bg-green-500" : "bg-green-500 hover:bg-green-400"} text-white flex items-center`}
            >
              <Download className="mr-2" /> Download JSON
            </button>
            {/* Copy JSON Button */}
            <button
              onClick={copyJsonToClipboard}
              className={`py-2 px-4 rounded-md ${isDarkMode ? "bg-yellow-600 hover:bg-yellow-500" : "bg-yellow-500 hover:bg-yellow-400"} text-white flex items-center`}
            >
              <Clipboard className="mr-2" /> Copy JSON
            </button>
          </div>

          {/* Error Log */}
          <div className="mt-2 h-full">
            {copySuccess ? (
              <div className="text-green-500 text-sm">{copySuccess}</div>
            ) : error ? (
              <div className="text-red-500 text-sm">
                <strong>Error:</strong> {error}
              </div>
            ) : (
              jsonInput && (
                <div className="flex">
                  <Check />
                  <div className="text-green-500 text-sm">JSON is valid!</div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JsonInput;
