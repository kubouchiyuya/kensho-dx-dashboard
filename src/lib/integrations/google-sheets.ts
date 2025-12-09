/**
 * Google Sheets API連携
 *
 * Google Sheets APIを使用してスプレッドシートのデータを読み書き
 * https://developers.google.com/sheets/api
 */

// Google API設定
const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY || '';
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';

// スプレッドシート設定
export interface SpreadsheetConfig {
  spreadsheetId: string;
  sheetName: string;
  range?: string;  // 例: 'A1:Z1000'
}

// 行データ型
export type SheetRow = (string | number | boolean | null)[];
export type SheetData = SheetRow[];

/**
 * サービスアカウントトークン取得（サーバーサイド用）
 */
async function getServiceAccountToken(): Promise<string> {
  // Note: 本番環境ではサービスアカウントのJSONキーを使用
  // ここでは簡易的にAPI Keyを使用
  return GOOGLE_API_KEY;
}

/**
 * スプレッドシートからデータを取得
 */
export async function fetchSheetData(
  config: SpreadsheetConfig
): Promise<SheetData> {
  const range = config.range
    ? `${config.sheetName}!${config.range}`
    : config.sheetName;

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${config.spreadsheetId}/values/${encodeURIComponent(range)}?key=${GOOGLE_API_KEY}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Google Sheets Error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.values || [];
}

/**
 * スプレッドシートにデータを書き込み（OAuth必要）
 */
export async function writeSheetData(
  config: SpreadsheetConfig,
  values: SheetData,
  accessToken: string
): Promise<void> {
  const range = config.range
    ? `${config.sheetName}!${config.range}`
    : config.sheetName;

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${config.spreadsheetId}/values/${encodeURIComponent(range)}?valueInputOption=USER_ENTERED`;

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ values }),
  });

  if (!response.ok) {
    throw new Error(`Google Sheets Write Error: ${response.statusText}`);
  }
}

/**
 * スプレッドシートに行を追加（OAuth必要）
 */
export async function appendSheetData(
  config: SpreadsheetConfig,
  values: SheetData,
  accessToken: string
): Promise<void> {
  const range = config.sheetName;

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${config.spreadsheetId}/values/${encodeURIComponent(range)}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ values }),
  });

  if (!response.ok) {
    throw new Error(`Google Sheets Append Error: ${response.statusText}`);
  }
}

/**
 * 建匠DX用 スプレッドシート設定
 */
export const KENSHO_SHEETS = {
  // 売上管理シート
  sales: {
    spreadsheetId: process.env.NEXT_PUBLIC_GOOGLE_SALES_SHEET_ID || '',
    sheetName: '売上一覧',
    range: 'A2:Z1000',
  },
  // KPI管理シート
  kpi: {
    spreadsheetId: process.env.NEXT_PUBLIC_GOOGLE_KPI_SHEET_ID || '',
    sheetName: 'KPI',
    range: 'A2:Z100',
  },
  // 案件管理シート
  projects: {
    spreadsheetId: process.env.NEXT_PUBLIC_GOOGLE_PROJECTS_SHEET_ID || '',
    sheetName: '案件一覧',
    range: 'A2:Z1000',
  },
  // 顧客管理シート
  customers: {
    spreadsheetId: process.env.NEXT_PUBLIC_GOOGLE_CUSTOMERS_SHEET_ID || '',
    sheetName: '顧客一覧',
    range: 'A2:Z1000',
  },
};

/**
 * スプレッドシートの行を建匠DXのデータ型に変換
 * 列順: A:ID, B:物件名, C:顧客名, D:種別, E:ステータス, F:契約額, G:予定原価, H:実績原価, ...
 */
export function transformSheetToProject(row: SheetRow, rowIndex: number) {
  return {
    id: String(row[0] || rowIndex + 1),
    name: String(row[1] || ''),
    customer: String(row[2] || ''),
    type: String(row[3] || ''),
    status: String(row[4] || ''),
    contractAmount: Number(row[5]) || 0,
    estimatedCost: Number(row[6]) || 0,
    actualCost: Number(row[7]) || 0,
    startDate: String(row[8] || ''),
    endDate: String(row[9] || ''),
    progress: Number(row[10]) || 0,
    salesRep: String(row[11] || ''),
  };
}

export function transformSheetToDeal(row: SheetRow, rowIndex: number) {
  return {
    id: String(row[0] || rowIndex + 1),
    name: String(row[1] || ''),
    customer: String(row[2] || ''),
    amount: Number(row[3]) || 0,
    probability: Number(row[4]) || 0,
    status: String(row[5] || ''),
    salesRep: String(row[6] || ''),
    nextAction: String(row[7] || ''),
    nextDate: String(row[8] || ''),
  };
}

export function transformSheetToCustomer(row: SheetRow, rowIndex: number) {
  return {
    id: String(row[0] || rowIndex + 1),
    name: String(row[1] || ''),
    company: String(row[2] || ''),
    email: String(row[3] || ''),
    phone: String(row[4] || ''),
    address: String(row[5] || ''),
    status: String(row[6] || ''),
    source: String(row[7] || ''),
    totalAmount: Number(row[8]) || 0,
    lastContact: String(row[9] || ''),
  };
}

export function transformSheetToSales(row: SheetRow, rowIndex: number) {
  return {
    id: String(row[0] || rowIndex + 1),
    date: String(row[1] || ''),
    projectName: String(row[2] || ''),
    customer: String(row[3] || ''),
    amount: Number(row[4]) || 0,
    type: String(row[5] || ''),
    salesRep: String(row[6] || ''),
  };
}

/**
 * Google OAuth URL生成
 */
export function getGoogleOAuthUrl(redirectUri: string): string {
  const scopes = [
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/drive.readonly',
  ].join(' ');

  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: scopes,
    access_type: 'offline',
    prompt: 'consent',
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

/**
 * OAuth認証コードをトークンに交換
 */
export async function exchangeCodeForTokens(
  code: string,
  redirectUri: string
): Promise<{ accessToken: string; refreshToken: string }> {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      code,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }),
  });

  const data = await response.json();

  if (data.error) {
    throw new Error(`OAuth Error: ${data.error_description}`);
  }

  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
  };
}
