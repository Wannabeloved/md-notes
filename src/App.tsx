// import PWABadge from './PWABadge.tsx'
import "./App.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import { Providers } from "./providers";
import { EditorPage } from "./pages/EditorPage";
import { CssBaseline } from "@mui/material";
import { Navigate, Route, Routes } from "react-router";
import Layout from "./components/Layout";
import { NewPage } from "./pages/NewPage";

function App() {
  return (
    <>
      <CssBaseline />
      <Providers>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Navigate to="/new" />} />
            <Route path="new" element={<NewPage />} />
            <Route path=":id" element={<EditorPage />} />
          </Route>
        </Routes>
      </Providers>
    </>
  );
}

export default App;
