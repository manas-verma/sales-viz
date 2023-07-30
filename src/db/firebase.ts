import admin from "firebase-admin";
import path from "path";
import fs from "fs";

const serviceAccountPath = path.join(process.cwd(), "firebase-key.json");

// Read the contents of the serviceAccountKey.json file
const getServiceAccountKey = () => {
  try {
    const serviceAccountKey = fs.readFileSync(serviceAccountPath, "utf8");
    const response = JSON.parse(serviceAccountKey);
    return {
      ...response,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: Buffer.from(
        process.env.FIREBASE_PRIVATE_KEY ?? "",
        "base64"
      ).toString("ascii"),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
      client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
    };
  } catch (error) {
    console.error("Error reading serviceAccountKey.json:", error);
    return null;
  }
};

const serviceAccount = getServiceAccountKey();

if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const client = admin.firestore();
export default client;
