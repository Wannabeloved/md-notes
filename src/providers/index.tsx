import { type ReactNode } from "react";

// import { TSProvider } from "./TSProvider";
// import { HighlightProvider } from "./HighlightProvider";
import { DBProvider } from "./DBProvider";
import { BrowserRouter } from "react-router";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <BrowserRouter>
      <DBProvider>
        {/* <TSProvider> */}
        {/* <HighlightProvider> */}
        {children}
        {/* </HighlightProvider> */}
        {/* </TSProvider> */}
      </DBProvider>
    </BrowserRouter>
  );
}
