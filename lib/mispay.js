import crypto from "crypto";

const BASE_URL = process.env.NEXT_PUBLIC_MIS_BASE_URL;
const APP_ID = process.env.NEXT_PUBLIC_MIS_API_ID;
const APP_SECRET = process.env.NEXT_PUBLIC_MIS_API_KEY;

export async function getAccessToken() {
  const res = await fetch(`${BASE_URL}/token`, {
    method: "GET",
    headers: {
      "x-app-id": APP_ID,
      "x-app-secret": APP_SECRET,
    },
  });

  const data = await res.json();
  if (data.status !== "success") {
    throw new Error("MIS token fetch failed: " + JSON.stringify(data));
  }

  const decrypted = decryptAES(data.result.token, APP_SECRET);
  return decrypted.token; // real JWT from MIS
}

// AES-256-GCM decryption based on MIS docs
export function decryptAES(ciphertext, secret) {
  const input = Buffer.from(ciphertext, "base64");
  const salt = input.subarray(0, 16);
  const nonce = input.subarray(16, 28);
  const enc = input.subarray(28, -16);
  const tag = input.subarray(-16);

  const key = crypto.pbkdf2Sync(secret, salt, 40000, 32, "sha256");

  const decipher = crypto.createDecipheriv("aes-256-gcm", key, nonce);
  decipher.setAuthTag(tag);

  const decrypted = Buffer.concat([
    decipher.update(enc),
    decipher.final(),
  ]).toString("utf8");

  return JSON.parse(decrypted);
}