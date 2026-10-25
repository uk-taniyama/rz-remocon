import type { RemoconConfig } from "../api";
import type { RemoteKeyIconRender } from "../web/remoteKeys";
import { RemoteKeyLayout } from "../web/remoteKeys/RemoteKeyLayout";

/** `HtmlView` の `props`。 */
export interface HtmlViewProps {
  cssPath: string;
  jsPath: string;
  remocon: RemoconConfig;
  iconRender?: RemoteKeyIconRender;
}

/**
 * 静的リモコンの HTML ドキュメント全体を表すコンポーネント。
 * `MainView` と同じ構成の画面を描画するため、`MainView` と同じ見た目の HTML を生成できる。
 */
export default function HtmlView({
  cssPath,
  jsPath,
  remocon,
  iconRender,
}: HtmlViewProps) {
  const { grid, keys, background } = remocon;
  return (
    <html lang="ja">
      <head>
        <meta charSet="UTF-8" />
        <link rel="icon" type="image/svg+xml" href="favicon.svg" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, viewport-fit=cover"
        />
        <title>rz-remocon</title>
        <link rel="stylesheet" href={cssPath} />
      </head>
      <body>
        <main className="container" style={{ backgroundColor: background }}>
          <div className="content">
            <div id="remote" className="remote-key-container">
              <RemoteKeyLayout
                keys={keys}
                cellsPerKey={grid.unit}
                columns={grid.columns}
                iconRender={iconRender}
              />
            </div>
          </div>
        </main>
        <script src={jsPath} defer />
      </body>
    </html>
  );
}

/** `HtmlView` を描画する要素を生成する。 */
export function renderHtml(props: HtmlViewProps) {
  return <HtmlView {...props} />;
}
