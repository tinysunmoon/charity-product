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

  // Only keep rows whose first cell starts with "prod_" (skips header or empty rows)
  return rows
    .filter((row) => (row[0] ?? "").startsWith("prod_"))
    .map((row) => ({
      id:          row[0] ?? "",
      name:        row[1] ?? "",
      description: row[2] ?? "",
      price:       row[3] ?? "",
      imageUrl:    row[4] ?? "",
      createdAt:   row[5] ?? "",
    }));
}
