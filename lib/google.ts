import { google } from "googleapis";

function getAuth() {
  const privateKey = (process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY ?? "").replace(/\\n/g, "\n");
  return new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: privateKey,
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

export async function appendToSheet(row: string[]): Promise<void> {
  const auth   = getAuth();
  const sheets = google.sheets({ version: "v4", auth });

  await sheets.spreadsheets.values.append({
    spreadsheetId:   process.env.GOOGLE_SHEET_ID!,
    range:           "A:F",
    valueInputOption: "USER_ENTERED",
    requestBody:     { values: [row] },
  });
}

export async function getProducts(): Promise<Record<string, string>[]> {
  const auth   = getAuth();
  const sheets = google.sheets({ version: "v4", auth });

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID!,
    range:         "A:F",
  });

  const rows = res.data.values ?? [];
  if (rows.length < 2) return [];

  const [header, ...data] = rows;
  return data.map((row) =>
    Object.fromEntries(header.map((h: string, i: number) => [h, row[i] ?? ""]))
  );
}
