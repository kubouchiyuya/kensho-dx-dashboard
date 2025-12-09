/**
 * Excel ファイル インポート/エクスポート機能
 *
 * xlsxライブラリを使用してExcelファイルの読み書き
 * https://sheetjs.com/
 */

import * as XLSX from 'xlsx';

// ワークシート型
export type ExcelRow = Record<string, unknown>;
export type ExcelData = ExcelRow[];

/**
 * Excelファイルを読み込み
 */
export function readExcelFile(file: File): Promise<{ sheets: Record<string, ExcelData>; sheetNames: string[] }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });

        const sheets: Record<string, ExcelData> = {};

        workbook.SheetNames.forEach((sheetName) => {
          const worksheet = workbook.Sheets[sheetName];
          sheets[sheetName] = XLSX.utils.sheet_to_json(worksheet);
        });

        resolve({
          sheets,
          sheetNames: workbook.SheetNames,
        });
      } catch (error) {
        reject(new Error(`Excel読み込みエラー: ${error}`));
      }
    };

    reader.onerror = () => {
      reject(new Error('ファイル読み込みに失敗しました'));
    };

    reader.readAsBinaryString(file);
  });
}

/**
 * 特定シートのみを読み込み
 */
export function readExcelSheet(file: File, sheetName: string): Promise<ExcelData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });

        const worksheet = workbook.Sheets[sheetName];
        if (!worksheet) {
          throw new Error(`シート "${sheetName}" が見つかりません`);
        }

        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        resolve(jsonData as ExcelData);
      } catch (error) {
        reject(new Error(`Excel読み込みエラー: ${error}`));
      }
    };

    reader.onerror = () => {
      reject(new Error('ファイル読み込みに失敗しました'));
    };

    reader.readAsBinaryString(file);
  });
}

/**
 * データをExcelファイルとしてエクスポート
 */
export function exportToExcel(
  data: ExcelData,
  filename: string,
  sheetName: string = 'Sheet1'
): void {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  // ダウンロード
  XLSX.writeFile(workbook, filename);
}

/**
 * 複数シートをExcelファイルとしてエクスポート
 */
export function exportMultipleSheetsToExcel(
  sheets: { name: string; data: ExcelData }[],
  filename: string
): void {
  const workbook = XLSX.utils.book_new();

  sheets.forEach(({ name, data }) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, name);
  });

  XLSX.writeFile(workbook, filename);
}

/**
 * Excel行を建匠DXのプロジェクト型に変換
 */
export function transformExcelToProject(row: ExcelRow) {
  return {
    id: String(row['ID'] || row['id'] || ''),
    name: String(row['物件名'] || row['name'] || ''),
    customer: String(row['顧客名'] || row['customer'] || ''),
    type: String(row['種別'] || row['type'] || ''),
    status: String(row['ステータス'] || row['status'] || ''),
    contractAmount: Number(row['契約額'] || row['contractAmount']) || 0,
    estimatedCost: Number(row['予定原価'] || row['estimatedCost']) || 0,
    actualCost: Number(row['実績原価'] || row['actualCost']) || 0,
    startDate: String(row['着工日'] || row['startDate'] || ''),
    endDate: String(row['完工予定日'] || row['endDate'] || ''),
    progress: Number(row['進捗率'] || row['progress']) || 0,
    salesRep: String(row['担当者'] || row['salesRep'] || ''),
  };
}

export function transformExcelToDeal(row: ExcelRow) {
  return {
    id: String(row['ID'] || row['id'] || ''),
    name: String(row['案件名'] || row['name'] || ''),
    customer: String(row['顧客名'] || row['customer'] || ''),
    amount: Number(row['金額'] || row['amount']) || 0,
    probability: Number(row['確度'] || row['probability']) || 0,
    status: String(row['ステージ'] || row['status'] || ''),
    salesRep: String(row['担当者'] || row['salesRep'] || ''),
    nextAction: String(row['次回アクション'] || row['nextAction'] || ''),
    nextDate: String(row['次回予定日'] || row['nextDate'] || ''),
  };
}

export function transformExcelToCustomer(row: ExcelRow) {
  return {
    id: String(row['ID'] || row['id'] || ''),
    name: String(row['顧客名'] || row['name'] || ''),
    company: String(row['会社名'] || row['company'] || ''),
    email: String(row['メール'] || row['email'] || ''),
    phone: String(row['電話番号'] || row['phone'] || ''),
    address: String(row['住所'] || row['address'] || ''),
    status: String(row['ステータス'] || row['status'] || ''),
    source: String(row['獲得経路'] || row['source'] || ''),
    totalAmount: Number(row['累計取引額'] || row['totalAmount']) || 0,
    lastContact: String(row['最終連絡日'] || row['lastContact'] || ''),
  };
}

export function transformExcelToSales(row: ExcelRow) {
  return {
    id: String(row['ID'] || row['id'] || ''),
    date: String(row['日付'] || row['date'] || ''),
    projectName: String(row['物件名'] || row['projectName'] || ''),
    customer: String(row['顧客名'] || row['customer'] || ''),
    amount: Number(row['金額'] || row['amount']) || 0,
    type: String(row['種別'] || row['type'] || ''),
    salesRep: String(row['担当者'] || row['salesRep'] || ''),
  };
}

export function transformExcelToCost(row: ExcelRow) {
  return {
    id: String(row['ID'] || row['id'] || ''),
    projectId: String(row['物件ID'] || row['projectId'] || ''),
    projectName: String(row['物件名'] || row['projectName'] || ''),
    category: String(row['費目'] || row['category'] || ''),
    vendor: String(row['業者名'] || row['vendor'] || ''),
    estimatedAmount: Number(row['予定額'] || row['estimatedAmount']) || 0,
    actualAmount: Number(row['実績額'] || row['actualAmount']) || 0,
    date: String(row['計上日'] || row['date'] || ''),
    note: String(row['備考'] || row['note'] || ''),
  };
}

/**
 * 建匠DXデータをExcelエクスポート用に変換
 */
export function transformProjectToExcel(project: {
  id: string;
  name: string;
  customer: string;
  type: string;
  status: string;
  contractAmount: number;
  estimatedCost: number;
  actualCost: number;
  startDate: string;
  endDate: string;
  progress: number;
  salesRep: string;
}): ExcelRow {
  return {
    'ID': project.id,
    '物件名': project.name,
    '顧客名': project.customer,
    '種別': project.type,
    'ステータス': project.status,
    '契約額': project.contractAmount,
    '予定原価': project.estimatedCost,
    '実績原価': project.actualCost,
    '着工日': project.startDate,
    '完工予定日': project.endDate,
    '進捗率': project.progress,
    '担当者': project.salesRep,
  };
}

/**
 * Excelテンプレートを生成
 */
export function generateExcelTemplate(type: 'projects' | 'deals' | 'customers' | 'costs' | 'sales'): void {
  const templates: Record<string, { headers: string[]; sample: ExcelRow }> = {
    projects: {
      headers: ['ID', '物件名', '顧客名', '種別', 'ステータス', '契約額', '予定原価', '実績原価', '着工日', '完工予定日', '進捗率', '担当者'],
      sample: {
        'ID': '1',
        '物件名': '山田邸新築工事',
        '顧客名': '山田太郎',
        '種別': '新築',
        'ステータス': '進行中',
        '契約額': 35000000,
        '予定原価': 28000000,
        '実績原価': 15000000,
        '着工日': '2024-10-01',
        '完工予定日': '2025-03-31',
        '進捗率': 45,
        '担当者': '佐藤一郎',
      },
    },
    deals: {
      headers: ['ID', '案件名', '顧客名', '金額', '確度', 'ステージ', '担当者', '次回アクション', '次回予定日'],
      sample: {
        'ID': '1',
        '案件名': '鈴木邸リフォーム相談',
        '顧客名': '鈴木花子',
        '金額': 8000000,
        '確度': 60,
        'ステージ': '商談中',
        '担当者': '田中次郎',
        '次回アクション': '見積提出',
        '次回予定日': '2024-12-15',
      },
    },
    customers: {
      headers: ['ID', '顧客名', '会社名', 'メール', '電話番号', '住所', 'ステータス', '獲得経路', '累計取引額', '最終連絡日'],
      sample: {
        'ID': '1',
        '顧客名': '山田太郎',
        '会社名': '',
        'メール': 'yamada@example.com',
        '電話番号': '090-1234-5678',
        '住所': '高知県高知市〇〇町1-2-3',
        'ステータス': 'アクティブ',
        '獲得経路': 'HP問い合わせ',
        '累計取引額': 35000000,
        '最終連絡日': '2024-12-05',
      },
    },
    costs: {
      headers: ['ID', '物件ID', '物件名', '費目', '業者名', '予定額', '実績額', '計上日', '備考'],
      sample: {
        'ID': '1',
        '物件ID': 'P001',
        '物件名': '山田邸新築工事',
        '費目': '材料費',
        '業者名': '〇〇建材',
        '予定額': 5000000,
        '実績額': 4800000,
        '計上日': '2024-11-15',
        '備考': '木材一式',
      },
    },
    sales: {
      headers: ['ID', '日付', '物件名', '顧客名', '金額', '種別', '担当者'],
      sample: {
        'ID': '1',
        '日付': '2024-12-01',
        '物件名': '山田邸新築工事',
        '顧客名': '山田太郎',
        '金額': 35000000,
        '種別': '新築',
        '担当者': '佐藤一郎',
      },
    },
  };

  const template = templates[type];
  if (!template) {
    throw new Error(`Unknown template type: ${type}`);
  }

  // ヘッダー行とサンプルデータ
  const data = [template.sample];

  exportToExcel(data, `建匠DX_${type}_テンプレート.xlsx`, type);
}
