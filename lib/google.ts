import { google } from "googleapis";

function getAuth() {
  const privateKey = (process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY ?? "").replace(/\\n/g, "\n");
  return new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: privateKey,
    },
    scopes: [
      "https://www.googleapis.com/auth/drive",
      "https://www.googleapis.com/auth/spreadsheets",
    ],
  });
}

export async function uploadToDrive(
  fileBuffer: Buffer,
  fileName: string,
  mimeType: string
): Promise<string> {
  const auth = getAuth();
  const drive = google.drive({ version: "v3", auth });

  const { Readable } = await import("stream");
  const stream = Readable.from(fileBuffer);

  const res = await drive.files.create({
    requestBody: {
      name: fileName,
      parents: [process.env.GOOGLE_DRIVE_FOLDER_ID!],
    },
    media: { mimeType, body: stream },
    fields: "id",
  });

  const fileId = res.data.id!;

  await drive.permissions.create({
    fileId,
    requestBody: { role: "reader", type: "anyone" },
  });

  return `https://drive.google.com/uc?export=view&id=${fileId}`;
}

export async function appendToSheet(row: string[]): Promise<void> {
  const auth = getAuth();
  const sheets = google.sheets({ version: "v4", auth });

  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.GOOGLE_SHEET_ID!,
    range: "Products!A:F",
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [row] },
  });
}

export async function getProducts(): Promise<Record<string, string>[]> {
  const auth = getAuth();
  const sheets = google.sheets({ version: "v4", auth });

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID!,
    range: "Products!A:F",
  });

  const rows = res.data.values ?? [];
  if (rows.length < 2) return [];

  const [header, ...data] = rows;
  return data.map((row) =>
    Object.fromEntries(header.map((h: string, i: number) => [h, row[i] ?? ""]))
  );
}
