import { useState, useEffect } from "react";
import JsonInput from "./components/JsonInput";
import FormGenerator from "./components/FormGenerator";
import { Sun, Moon } from "lucide-react";

function App() {
  const [activeTab, setActiveTab] = useState<"left" | "right">("left"); // Track active tab
  const [jsonData, setJsonData] = useState<string>("");
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Toggle theme
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Save the theme preference in localStorage
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      setIsDarkMode(storedTheme === "dark");
    }
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  return (
    <div
      className={`min-h-screen h-full ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
      }`}
    >
      {/* Dark/Light Mode Toggle */}
      <div className="flex justify-end p-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700"
        >
          {isDarkMode ? (
            <Sun className="text-yellow-400" size={24} />
          ) : (
            <Moon className="text-blue-400" size={24} />
          )}
        </button>
      </div>

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
          <JsonInput
            onInputChange={(data) => setJsonData(data)}
            isDarkMode={isDarkMode}
          />
        </div>

        {/* Right JsonInput Component */}
        <div
          className={`flex-1 w-full md:block ${
            activeTab === "right" ? "block" : "hidden"
          }`}
        >
          <FormGenerator jsonData={jsonData} isDarkMode={isDarkMode} />
        </div>
      </div>
    </div>
  );
}

export default App;
