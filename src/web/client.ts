import { getClient } from "../api";

/**
 * 画面全体で共有する API クライアント。
 * 同じオリジンの API だけを呼び出すため、1つを共有すれば足りる。
 * window を読むため、Web アプリ（src/web）だけが使う。remoteKeys は、クライアントを引数で受け取る。
 */
export const apiClient = getClient(window.location.origin);
