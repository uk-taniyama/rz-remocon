import crypto from "node:crypto";
import DigestFetch from "digest-fetch";

/**
 * 接続要求に使用するランダムなユーザー ID を生成する。
 * MAC アドレスに似た形式（`XX-XX-XX-XX-XX-XX`）で、ローカル管理のユニキャストアドレスになるようにビットを設定する。
 */
export function randomUserId() {
  const bytes = crypto.randomBytes(6);

  bytes[0] = (bytes[0] | 0x02) & 0xfe;

  return [...bytes]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("-")
    .toUpperCase();
}

/**
 * REGZA が返した暗号化済みのパスワードを、PIN と salt を使用して復号する。
 *
 * @param encryptedPassword - 暗号化されたパスワード（16進数の文字列）。
 * @param pin - REGZA に表示された PIN。
 * @param salt - 接続要求で取得した salt。
 * @returns 復号したパスワード。
 */
export function decryptPassword(
  encryptedPassword: string,
  pin: string,
  salt: string,
) {
  const key = crypto.pbkdf2Sync(
    Buffer.from(pin, "ascii"),
    Buffer.from(salt, "ascii"),
    1331,
    16,
    "sha1",
  );

  const decipher = crypto.createDecipheriv(
    "aes-128-cbc",
    key,
    Buffer.alloc(16),
  );

  return Buffer.concat([
    decipher.update(Buffer.from(encryptedPassword, "hex")),
    decipher.final(),
  ]).toString("ascii");
}

/** Digest 認証付きで fetch できるクライアントを生成する。 */
export function createDigestClient(userId: string, password: string) {
  return new DigestFetch(userId, password);
}
