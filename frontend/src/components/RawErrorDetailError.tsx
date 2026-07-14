import React from "react";
import { ErrorTrace } from "./ErrorTrace";
const data = {
  error: {
    type: "TypeError",
    message: "Cannot read properties of null (reading 'map')",
    file: "/app/components/MovieList.jsx",
    line: 24,
    stack: [
      {
        function: "Array.map",
        location: "<anonymous>",
      },
      {
        function: "MovieList",
        location: "/app/components/MovieList.jsx:24:18",
        source: true,
      },
      {
        function: "renderWithHooks",
        location:
          "/app/node_modules/react-dom/cjs/react-dom.development.js:14985:18",
      },
    ],
  },
};
const RawErrorDetailError = () => {
  return (
    <div className="w-2/5">
      <div className="flex gap-2.5 text-muted-foreground items-center text-sm font-semibold">
        RAW ERROR <span className="bg-border h-px flex-1"></span>
      </div>
      <ErrorTrace />
    </div>
  );
};

export default RawErrorDetailError;
