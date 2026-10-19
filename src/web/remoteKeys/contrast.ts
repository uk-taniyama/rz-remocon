/**
 * 文字色を切り替える境界の相対輝度（L）。L がこの値より大きい背景には黒、この値以下の背景には白を使用する。
 * 0.6 は、薄い色（薄緑、薄いグレー、白）だけを黒にするための値。
 * 黄橙（#faad14、L ≈ 0.50）や黄緑（#84cc16、L ≈ 0.48）は、白のままになる。
 */
export const TEXT_COLOR_LUMINANCE_THRESHOLD = 0.6;

/**
 * 背景色の相対輝度を、WCAG の式で算出する。
 *
 * @param background - 背景色（#RRGGBB）。
 */
export function relativeLuminance(background: string): number {
  const channel = (start: number) => {
    const c = Number.parseInt(background.slice(start, start + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(1) + 0.7152 * channel(3) + 0.0722 * channel(5);
}

/**
 * 背景色の上に表示する文字色（白または黒）を返す。
 * 閾値を省略した場合は、TEXT_COLOR_LUMINANCE_THRESHOLD を使用する（呼び出し側が値を持つ必要はない）。
 *
 * @param background - 背景色（#RRGGBB）。
 * @param threshold - 文字色を切り替える境界の相対輝度。
 */
export function readableTextColor(
  background: string,
  threshold: number = TEXT_COLOR_LUMINANCE_THRESHOLD,
): "#ffffff" | "#000000" {
  return relativeLuminance(background) > threshold ? "#000000" : "#ffffff";
}
