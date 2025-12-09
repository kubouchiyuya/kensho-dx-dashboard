/**
 * Lark Bitable API連携
 *
 * Lark Open Platform APIを使用してBitableのデータを読み書き
 * https://open.larksuite.com/document/server-docs/docs/bitable-v1/
 */

// Lark API設定
const LARK_APP_ID = process.env.NEXT_PUBLIC_LARK_APP_ID || '';
const LARK_APP_SECRET = process.env.LARK_APP_SECRET || '';
const LARK_API_BASE = 'https://open.larksuite.com/open-apis';

// アクセストークン取得
async function getTenantAccessToken(): Promise<string> {
  const response = await fetch(`${LARK_API_BASE}/auth/v3/tenant_access_token/internal`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      app_id: LARK_APP_ID,
      app_secret: LARK_APP_SECRET,
    }),
  });

  const data = await response.json();
  if (data.code !== 0) {
    throw new Error(`Lark API Error: ${data.msg}`);
  }
  return data.tenant_access_token;
}

// Bitable設定
export interface BitableConfig {
  appToken: string;      // BitableのアプリトークンID
  tableId: string;       // テーブルID
}

// レコード型定義
export interface BitableRecord {
  record_id: string;
  fields: Record<string, unknown>;
}

/**
 * Bitableからレコードを取得
 */
export async function fetchBitableRecords(
  config: BitableConfig,
  pageSize: number = 100
): Promise<BitableRecord[]> {
  const token = await getTenantAccessToken();

  const response = await fetch(
    `${LARK_API_BASE}/bitable/v1/apps/${config.appToken}/tables/${config.tableId}/records?page_size=${pageSize}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  const data = await response.json();
  if (data.code !== 0) {
    throw new Error(`Bitable Error: ${data.msg}`);
  }

  return data.data.items || [];
}

/**
 * Bitableにレコードを追加
 */
export async function createBitableRecord(
  config: BitableConfig,
  fields: Record<string, unknown>
): Promise<BitableRecord> {
  const token = await getTenantAccessToken();

  const response = await fetch(
    `${LARK_API_BASE}/bitable/v1/apps/${config.appToken}/tables/${config.tableId}/records`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fields }),
    }
  );

  const data = await response.json();
  if (data.code !== 0) {
    throw new Error(`Bitable Error: ${data.msg}`);
  }

  return data.data.record;
}

/**
 * Bitableのレコードを更新
 */
export async function updateBitableRecord(
  config: BitableConfig,
  recordId: string,
  fields: Record<string, unknown>
): Promise<BitableRecord> {
  const token = await getTenantAccessToken();

  const response = await fetch(
    `${LARK_API_BASE}/bitable/v1/apps/${config.appToken}/tables/${config.tableId}/records/${recordId}`,
    {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fields }),
    }
  );

  const data = await response.json();
  if (data.code !== 0) {
    throw new Error(`Bitable Error: ${data.msg}`);
  }

  return data.data.record;
}

/**
 * Bitableのレコードを削除
 */
export async function deleteBitableRecord(
  config: BitableConfig,
  recordId: string
): Promise<void> {
  const token = await getTenantAccessToken();

  const response = await fetch(
    `${LARK_API_BASE}/bitable/v1/apps/${config.appToken}/tables/${config.tableId}/records/${recordId}`,
    {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();
  if (data.code !== 0) {
    throw new Error(`Bitable Error: ${data.msg}`);
  }
}

/**
 * Larkグループにメッセージを送信
 */
export async function sendLarkMessage(
  chatId: string,
  message: string,
  msgType: 'text' | 'post' | 'interactive' = 'text'
): Promise<void> {
  const token = await getTenantAccessToken();

  const content = msgType === 'text'
    ? JSON.stringify({ text: message })
    : message;

  const response = await fetch(
    `${LARK_API_BASE}/im/v1/messages?receive_id_type=chat_id`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        receive_id: chatId,
        msg_type: msgType,
        content,
      }),
    }
  );

  const data = await response.json();
  if (data.code !== 0) {
    throw new Error(`Lark Message Error: ${data.msg}`);
  }
}

/**
 * 建匠DX用 Bitableテーブル設定
 */
export const KENSHO_BITABLE_TABLES = {
  // 案件管理テーブル
  projects: {
    appToken: process.env.NEXT_PUBLIC_LARK_BITABLE_APP_TOKEN || '',
    tableId: process.env.NEXT_PUBLIC_LARK_PROJECTS_TABLE_ID || '',
  },
  // 顧客管理テーブル
  customers: {
    appToken: process.env.NEXT_PUBLIC_LARK_BITABLE_APP_TOKEN || '',
    tableId: process.env.NEXT_PUBLIC_LARK_CUSTOMERS_TABLE_ID || '',
  },
  // 商談管理テーブル
  deals: {
    appToken: process.env.NEXT_PUBLIC_LARK_BITABLE_APP_TOKEN || '',
    tableId: process.env.NEXT_PUBLIC_LARK_DEALS_TABLE_ID || '',
  },
  // 原価管理テーブル
  costs: {
    appToken: process.env.NEXT_PUBLIC_LARK_BITABLE_APP_TOKEN || '',
    tableId: process.env.NEXT_PUBLIC_LARK_COSTS_TABLE_ID || '',
  },
  // 工程管理テーブル
  schedules: {
    appToken: process.env.NEXT_PUBLIC_LARK_BITABLE_APP_TOKEN || '',
    tableId: process.env.NEXT_PUBLIC_LARK_SCHEDULES_TABLE_ID || '',
  },
};

/**
 * Bitableフィールドを建匠DXのデータ型に変換
 */
export function transformBitableToProject(record: BitableRecord) {
  const fields = record.fields as Record<string, unknown>;
  return {
    id: record.record_id,
    name: fields['物件名'] as string || '',
    customer: fields['顧客名'] as string || '',
    type: fields['種別'] as string || '',
    status: fields['ステータス'] as string || '',
    contractAmount: Number(fields['契約額']) || 0,
    estimatedCost: Number(fields['予定原価']) || 0,
    actualCost: Number(fields['実績原価']) || 0,
    startDate: fields['着工日'] as string || '',
    endDate: fields['完工予定日'] as string || '',
    progress: Number(fields['進捗率']) || 0,
    salesRep: fields['担当者'] as string || '',
  };
}

export function transformBitableToDeal(record: BitableRecord) {
  const fields = record.fields as Record<string, unknown>;
  return {
    id: record.record_id,
    name: fields['案件名'] as string || '',
    customer: fields['顧客名'] as string || '',
    amount: Number(fields['金額']) || 0,
    probability: Number(fields['確度']) || 0,
    status: fields['ステージ'] as string || '',
    salesRep: fields['担当者'] as string || '',
    nextAction: fields['次回アクション'] as string || '',
    nextDate: fields['次回予定日'] as string || '',
  };
}

export function transformBitableToCustomer(record: BitableRecord) {
  const fields = record.fields as Record<string, unknown>;
  return {
    id: record.record_id,
    name: fields['顧客名'] as string || '',
    company: fields['会社名'] as string || '',
    email: fields['メール'] as string || '',
    phone: fields['電話番号'] as string || '',
    address: fields['住所'] as string || '',
    status: fields['ステータス'] as string || '',
    source: fields['獲得経路'] as string || '',
    totalAmount: Number(fields['累計取引額']) || 0,
    lastContact: fields['最終連絡日'] as string || '',
  };
}
