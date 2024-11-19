import { Check, Download } from "lucide-react"; // Import the Download icon from lucide-react
import { highlight, languages } from "prismjs";
import "prismjs/components/prism-json";
import "prismjs/themes/prism.css";
import { useEffect, useRef, useState } from "react";
import Editor from "react-simple-code-editor";

interface JsonInputProps {
  onInputChange: (data: string) => void; // Callback prop to pass JSON data
}

const JsonInput = ({ onInputChange }: JsonInputProps) => {
  const [jsonInput, setJsonInput] = useState<string>(""); // State to store JSON input
  const [error, setError] = useState<string | null>(null); // State to store errors
  const editorRef = useRef<HTMLDivElement>(null); // Ref for syncing scroll
  const [lineNumbers, setLineNumbers] = useState<string[]>([]); // State to store line numbers

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

  return (
    <div className="flex w-full h-screen flex-row">
      <div className="flex-1 bg-gray-800 text-gray-100 p-4 flex flex-col">
        <h1 className="text-center text-2xl font-bold mb-4">JSON Input Tab</h1>
        <div className="flex-1 overflow-hidden flex ">
          {/* Editor with Line Numbers inside */}
          <div
            ref={editorRef}
            className="h-full w-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 rounded-lg flex"
            style={{
              scrollbarWidth: "thin", // Firefox scrollbar styling
              scrollbarColor: "#4B5563 #2D3748", // Thumb and track color for Firefox
            }}
          >
            {/* Line numbers */}
            <div className="text-gray-400 mr-2 pt-2 font-mono whitespace-nowrap">
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
                className="bg-gray-800 text-gray-100 border-none focus:outline-none resize-none w-full"
                placeholder='{"key":"value"}   //place your json data here'
              />
            </div>
          </div>
        </div>

        {/* Buttons and Error Log */}
        <div className="mt-auto flex flex-col-reverse">
          {/* Buttons */}
          <div className="flex space-x-2 mt-2">
            {/* Prettify Button */}
            <button
              onClick={prettifyJson}
              className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-500"
            >
              Prettify JSON
            </button>

            {/* Download JSON Button */}
            <button
              onClick={downloadJson}
              className="py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-500 flex items-center"
            >
              <Download className="mr-2" /> Download JSON
            </button>
          </div>

          {/* Error Log */}
          <div className="mt-2 h-full   ">
            {error ? (
              <div className="text-red-500 text-sm">
                <strong>Error:</strong> {error}
              </div>
            ) : (
              jsonInput && (
                <div className="flex">
                  <Check></Check>
                  <div className="text-green-500 text-sm"> JSON is valid!</div>
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
