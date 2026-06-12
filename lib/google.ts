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

// ── Products ─────────────────────────────────────────────────────────────────

export async function appendProduct(row: string[]): Promise<void> {
  const auth   = getAuth();
  const sheets = google.sheets({ version: "v4", auth });
  await sheets.spreadsheets.values.append({
    spreadsheetId:    process.env.GOOGLE_SHEET_ID!,
    range:            "A:G",
    valueInputOption: "USER_ENTERED",
    requestBody:      { values: [row] },
  });
}

export async function getProducts(): Promise<Record<string, string>[]> {
  const auth   = getAuth();
  const sheets = google.sheets({ version: "v4", auth });
  const res    = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID!,
    range:         "A:G",
  });
  return (res.data.values ?? [])
    .filter(row => (row[0] ?? "").startsWith("prod_"))
    .map(row => ({
      id:          row[0] ?? "",
      name:        row[1] ?? "",
      description: row[2] ?? "",
      price:       row[3] ?? "",
      imageUrl:    row[4] ?? "",
      createdAt:   row[5] ?? "",
      status:      row[6] ?? "available",
    }));
}

export async function updateProductStatus(productId: string, status: string): Promise<void> {
  const auth   = getAuth();
  const sheets = google.sheets({ version: "v4", auth });
  const res    = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID!,
    range:         "A:A",
  });
  const rows     = res.data.values ?? [];
  const rowIndex = rows.findIndex(r => r[0] === productId);
  if (rowIndex === -1) return;
  await sheets.spreadsheets.values.update({
    spreadsheetId:    process.env.GOOGLE_SHEET_ID!,
    range:            `G${rowIndex + 1}`,
    valueInputOption: "USER_ENTERED",
    requestBody:      { values: [[ status ]] },
  });
}

// ── Orders ────────────────────────────────────────────────────────────────────
// Sheet tab must be named "Orders"
// Columns: orderId | productId | productName | customerName | customerEmail | quantity | notes | orderStatus | orderedAt

export async function appendOrder(row: string[]): Promise<void> {
  const auth   = getAuth();
  const sheets = google.sheets({ version: "v4", auth });
  await sheets.spreadsheets.values.append({
    spreadsheetId:    process.env.GOOGLE_SHEET_ID!,
    range:            "Orders!A:I",
    valueInputOption: "USER_ENTERED",
    requestBody:      { values: [row] },
  });
}

export async function getOrders(): Promise<Record<string, string>[]> {
  const auth   = getAuth();
  const sheets = google.sheets({ version: "v4", auth });
  const res    = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID!,
    range:         "Orders!A:I",
  });
  return (res.data.values ?? [])
    .filter(row => (row[0] ?? "").startsWith("order_"))
    .map(row => ({
      orderId:       row[0] ?? "",
      productId:     row[1] ?? "",
      productName:   row[2] ?? "",
      customerName:  row[3] ?? "",
      customerEmail: row[4] ?? "",
      quantity:      row[5] ?? "",
      notes:         row[6] ?? "",
      orderStatus:   row[7] ?? "",
      orderedAt:     row[8] ?? "",
    }));
}

export async function updateOrderStatus(orderId: string, orderStatus: string): Promise<string> {
  const auth   = getAuth();
  const sheets = google.sheets({ version: "v4", auth });
  const res    = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID!,
    range:         "Orders!A:B",
  });
  const rows     = res.data.values ?? [];
  const rowIndex = rows.findIndex(r => r[0] === orderId);
  if (rowIndex === -1) throw new Error("Không tìm thấy đơn hàng");
  const productId = rows[rowIndex][1] ?? "";
  await sheets.spreadsheets.values.update({
    spreadsheetId:    process.env.GOOGLE_SHEET_ID!,
    range:            `Orders!H${rowIndex + 1}`,
    valueInputOption: "USER_ENTERED",
    requestBody:      { values: [[ orderStatus ]] },
  });
  return productId;
}
