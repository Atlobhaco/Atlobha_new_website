// lib/mispay.js
import crypto from "crypto";

const MISPAY_BASE_URL = process.env.NEXT_PUBLIC_MIS_BASE_URL;
const APP_ID = process.env.NEXT_PUBLIC_MIS_API_ID;
const APP_SECRET = process.env.NEXT_PUBLIC_MIS_API_KEY;

export async function getAccessToken() {
  const res = await fetch(`${MISPAY_BASE_URL}/token`, {
    method: "GET",
    headers: {
      "x-app-id": APP_ID,
      "x-app-secret": APP_SECRET,
    },
  });

  const data = await res.json();
  if (data.status !== "success") {
    throw new Error("MIS Pay token request failed: " + JSON.stringify(data));
  }

  const encryptedToken = data.result.token;

  // ✅ Decrypt AES-256-GCM token
  const decrypted = decryptAES(encryptedToken, APP_SECRET);

  return decrypted.jwt; // contains actual JWT token
}

function decryptAES(encryptedData, secret) {
  // you'll adapt based on MIS Pay’s SDK / encryption structure
  try {
    const input = Buffer.from(encryptedData, "base64");

    const salt = input.subarray(0, 16);
    const iv = input.subarray(16, 28);
    const ciphertext = input.subarray(28, -16);
    const tag = input.subarray(-16);

    const key = crypto.pbkdf2Sync(secret, salt, 40000, 32, "sha256");

    const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
    decipher.setAuthTag(tag);

    const decrypted = Buffer.concat([
      decipher.update(ciphertext),
      decipher.final(),
    ]);
    return JSON.parse(decrypted.toString("utf-8"));
  } catch (error) {
    throw new Error("MIS Pay token decryption failed: " + error);
  }
}
