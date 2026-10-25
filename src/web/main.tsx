import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import MainView from "./views/MainView.tsx";

import "./main.css";

// ビューア専用のページ（`index.html`）。エディタは `editor.html` で、別に読み込む。
// biome-ignore lint/style/noNonNullAssertion: root 要素は必ず存在するため、無視する。
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MainView />
  </StrictMode>,
);
