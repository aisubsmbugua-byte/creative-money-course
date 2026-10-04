import { GoogleAuth } from "google-auth-library";

let auth: GoogleAuth | null = null;

function getAuth() {
  if (auth) return auth;

  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const key = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;
  if (!email || !key) {
    throw new Error(
      "GOOGLE_SERVICE_ACCOUNT_EMAIL / GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY are not configured",
    );
  }

  auth = new GoogleAuth({
    credentials: { client_email: email, private_key: key.replace(/\\n/g, "\n") },
    scopes: ["https://www.googleapis.com/auth/drive.readonly"],
  });
  return auth;
}

export async function fetchDriveFile(fileId: string, range: string | null) {
  const client = await getAuth().getClient();
  const { token } = await client.getAccessToken();

  return fetch(
    `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&supportsAllDrives=true`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        ...(range ? { Range: range } : {}),
      },
    },
  );
}
