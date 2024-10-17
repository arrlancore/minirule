import React, { useEffect, useRef, useState } from "react";
import MonacoEditor from "react-monaco-editor";
import { interpreter } from "minirule";
import { configureMiniruleLanguage } from "../editor-language";

const defaultInput = `
rule "New Customer Welcome"
when
  customer.registrationDate is between "2023-01-01" and "2023-12-31"
  and customer.orderCount < 3
  and order.total > 100
then
  apply 15% discount to order.total
end

rule "Double Points Weekend"
when
  date is between "2023-11-24" and "2023-11-26"
  and customer.loyaltyTier is "gold"
  and payment.type is "Bank Transfer"
  and order.total > 200
then
  apply 100% bonus to order.loyaltyPoints
end
`;

const MinirulePlayground: React.FC = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isInputValid, setIsInputValid] = useState(true);
  const [parsingTime, setParsingTime] = useState(0);
  const initialInputRef = useRef<string | null>(null);

  const editorDidMount = (editor: any, monaco: any) => {
    editor.focus();
  };

  const onChange = (newValue: string) => {
    setInput(newValue);
  };

  const editorWillMount = (monaco: any) => {
    configureMiniruleLanguage(monaco);
  };

  const handleParse = () => {
    try {
      const perf = performance.now();
      const parsed = interpreter.interpret(input);
      const parseTime = performance.now() - perf;
      setParsingTime(parseTime);
      setOutput(JSON.stringify(parsed, null, 2));
    } catch (error) {
      console.error("Failed to parse DSL:", error);
      setParsingTime(0);
    }
  };

  useEffect(() => {
    const errorMsg = interpreter.validate(input);
    if (errorMsg) {
      setError(errorMsg);
      setIsInputValid(false);
    } else {
      setIsInputValid(true);
      setError(null);
    }

    if (parsingTime > 0) {
      setParsingTime(0);
    }
  }, [input]);

  const getInitialInput = () => {
    const params = new URLSearchParams(window.location.search);
    const inputParam = params.get("input");

    const urlSafeatob = (str: string) => {
      str = str.replace(/-/g, "+").replace(/_/g, "/");
      while (str.length % 4) str += "=";
      return atob(str);
    };

    if (inputParam) {
      try {
        return urlSafeatob(inputParam);
      } catch (e) {
        console.error("Failed to decode input parameter:", e);
      }
    }
    return defaultInput;
  };

  useEffect(() => {
    if (initialInputRef.current === null) {
      initialInputRef.current = getInitialInput();
      setInput(initialInputRef.current);
    }
  }, []);

  useEffect(() => {
    const urlSafebtoa = (str: string) => {
      return btoa(str)
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=/g, "");
    };

    if (input && input !== initialInputRef.current) {
      const encodedInput = urlSafebtoa(input);
      const newUrl = `${window.location.pathname}?input=${encodedInput}`;
      window.history.replaceState({}, "", newUrl);
    } else if (!input.trim()) {
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, [input]);

  return (
    <div className="flex flex-col md:flex-row gap-4 p-4">
      <div className="flex-1">
        <MonacoEditor
          width="100%"
          height="400"
          theme="vs-dark"
          value={input}
          onChange={onChange}
          editorDidMount={editorDidMount}
          editorWillMount={editorWillMount}
          language="minirule"
        />
        <button
          className={`mt-2 px-4 py-2 bg-blue-500 text-white rounded ${
            !isInputValid
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-blue-600"
          }`}
          disabled={!isInputValid}
          onClick={handleParse}
        >
          Make JSON
        </button>

        {error && <div className="mt-2 text-red-500 text-sm">{error}</div>}
        {parsingTime > 0 && (
          <div className="mt-2 text-green-500 text-sm">
            Parsing took {parsingTime.toFixed(2)} milliseconds
          </div>
        )}
      </div>
      <div className="flex-1">
        <MonacoEditor
          width="100%"
          height="400"
          theme="vs-dark"
          value={output}
          options={{ readOnly: true }}
          language="json"
        />
      </div>
    </div>
  );
};

export default MinirulePlayground;
