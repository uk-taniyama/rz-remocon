import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import EditorView from "./views/EditorView.tsx";

import "./editor.css";

// エディタ専用のページ（`editor.html`）。ビューア（`index.html`）とは、別のバンドルになる。
// biome-ignore lint/style/noNonNullAssertion: root 要素は必ず存在するため、無視する。
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <EditorView />
  </StrictMode>,
);
