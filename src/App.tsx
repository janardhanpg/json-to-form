import { useState } from "react";
import JsonInput from "./components/JsonInput";
import FormGenerator from "./components/FormGenerator";

function App() {
  const [activeTab, setActiveTab] = useState<"left" | "right">("left"); // Track active tab
  const [jsonData, setJsonData] = useState<string>("");

  return (
    <>
      {/* Title */}
      {/* <h1 className="font-bold text-center text-2xl md:text-3xl mt-4 mb-6">
        Dynamic Form Generator
      </h1> */}

      {/* Tabs for Mobile */}
      <div className="md:hidden flex justify-center space-x-4 mb-4">
        <button
          onClick={() => setActiveTab("left")}
          className={`py-2 px-4 rounded ${
            activeTab === "left"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          JSON Tab
        </button>
        <button
          onClick={() => setActiveTab("right")}
          className={`py-2 px-4 rounded ${
            activeTab === "right"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Form Tab
        </button>
      </div>

      {/* Main Container */}
      <div className="flex flex-col md:flex-row gap-4 px-4 md:px-8 h-screen">
        {/* Left JsonInput Component */}
        <div
          className={`flex-1 w-full md:block ${
            activeTab === "left" ? "block" : "hidden"
          }`}
        >
          <JsonInput onInputChange={(data) => setJsonData(data)} />
        </div>

        {/* Right JsonInput Component */}
        <div
          className={`flex-1 w-full md:block ${
            activeTab === "right" ? "block" : "hidden"
          }`}
        >
          <FormGenerator jsonData={jsonData} />
        </div>
      </div>
    </>
  );
}

export default App;
