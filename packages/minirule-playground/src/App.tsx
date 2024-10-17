import React from "react";
import MinirulePlayground from "./components/MinirulePlayground";

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-1">
        Minirule Playground
      </h1>
      <p className="p-2 mb-4 text-gray-700">
        Simple, readable business rule language for easy definition and
        interpretation.
      </p>
      <div className="w-full max-w-7xl bg-white shadow-md rounded-lg p-6">
        <MinirulePlayground />

        {/* simple copy writing */}
        <div className="mt-8 text-gray-700">
          <h2 className="text-2xl font-semibold mb-4">
            Why Choose Minirule for Your Business Logic?
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Readable Syntax:</strong> Write rules in a language that
              both technical and non-technical stakeholders can understand.
            </li>
            <li>
              <strong>Dynamic Business Terms:</strong> Easily adapt to changing
              business needs with flexible, dynamic terms.
            </li>
            <li>
              <strong>Built-in Validation:</strong> Ensure your rules are
              correctly formatted and logically sound.
            </li>
            <li>
              <strong>Efficient Interpretation:</strong> Quickly process and
              apply rules to your business data.
            </li>
            <li>
              <strong>No Programming Required:</strong> Empower business
              analysts to create and modify rules without deep coding knowledge.
            </li>
            <li>
              <strong>Collaboration-Friendly:</strong> Foster better
              communication between business and development teams.
            </li>
            <li>
              <strong>Highly Adaptable:</strong> Perfect for various industries
              and use cases, from e-commerce to finance.
            </li>
          </ul>
          {/* Developer section */}
          <div className="mt-12 border-t pt-8">
            <h2 className="text-3xl font-semibold mb-4 text-gray-800">
              For Developers
            </h2>
            <p className="text-lg mb-4">
              Minirule is an open-source project and we welcome contributions
              from the developer community. Whether you're interested in
              improving the core functionality, adding new features, or
              enhancing documentation, your input is valuable.
            </p>
            <a
              href="https://github.com/arrlancore/minirule"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300"
            >
              Contribute on GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
