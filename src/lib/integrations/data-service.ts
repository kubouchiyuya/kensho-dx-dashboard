/**
 * データ統合サービス
 *
 * Lark Bitable、Google Sheets、Excelからのデータを統合管理
 */

import {
  fetchBitableRecords,
  createBitableRecord,
  updateBitableRecord,
  KENSHO_BITABLE_TABLES,
  transformBitableToProject,
  transformBitableToDeal,
  transformBitableToCustomer,
} from './lark';

import {
  fetchSheetData,
  KENSHO_SHEETS,
  transformSheetToProject,
  transformSheetToDeal,
  transformSheetToCustomer,
  transformSheetToSales,
} from './google-sheets';

import {
  readExcelFile,
  transformExcelToProject,
  transformExcelToDeal,
  transformExcelToCustomer,
  transformExcelToSales,
  transformExcelToCost,
} from './excel';

// データソース種別
export type DataSource = 'lark' | 'sheets' | 'excel' | 'manual' | 'demo';

// 統合データ型
export interface Project {
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
  source?: DataSource;
}

export interface Deal {
  id: string;
  name: string;
  customer: string;
  amount: number;
  probability: number;
  status: string;
  salesRep: string;
  nextAction: string;
  nextDate: string;
  source?: DataSource;
}

export interface Customer {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  address: string;
  status: string;
  source: string;
  totalAmount: number;
  lastContact: string;
  dataSource?: DataSource;
}

export interface SalesRecord {
  id: string;
  date: string;
  projectName: string;
  customer: string;
  amount: number;
  type: string;
  salesRep: string;
  source?: DataSource;
}

// データストア（状態管理）
interface DataStore {
  projects: Project[];
  deals: Deal[];
  customers: Customer[];
  sales: SalesRecord[];
  lastUpdated: Date | null;
  dataSource: DataSource;
}

let dataStore: DataStore = {
  projects: [],
  deals: [],
  customers: [],
  sales: [],
  lastUpdated: null,
  dataSource: 'demo',
};

// データ取得結果
interface FetchResult<T> {
  data: T[];
  source: DataSource;
  error?: string;
}

/**
 * Lark Bitableからプロジェクトデータを取得
 */
export async function fetchProjectsFromLark(): Promise<FetchResult<Project>> {
  try {
    const records = await fetchBitableRecords(KENSHO_BITABLE_TABLES.projects);
    const projects = records.map(r => ({
      ...transformBitableToProject(r),
      source: 'lark' as DataSource,
    }));
    return { data: projects, source: 'lark' };
  } catch (error) {
    return { data: [], source: 'lark', error: String(error) };
  }
}

/**
 * Google Sheetsからプロジェクトデータを取得
 */
export async function fetchProjectsFromSheets(): Promise<FetchResult<Project>> {
  try {
    const rows = await fetchSheetData(KENSHO_SHEETS.projects);
    const projects = rows.map((row, i) => ({
      ...transformSheetToProject(row, i),
      source: 'sheets' as DataSource,
    }));
    return { data: projects, source: 'sheets' };
  } catch (error) {
    return { data: [], source: 'sheets', error: String(error) };
  }
}

/**
 * Excelファイルからプロジェクトデータを取得
 */
export async function fetchProjectsFromExcel(file: File): Promise<FetchResult<Project>> {
  try {
    const { sheets } = await readExcelFile(file);
    const sheetData = sheets['案件一覧'] || sheets['projects'] || Object.values(sheets)[0];
    const projects = sheetData.map(row => ({
      ...transformExcelToProject(row),
      source: 'excel' as DataSource,
    }));
    return { data: projects, source: 'excel' };
  } catch (error) {
    return { data: [], source: 'excel', error: String(error) };
  }
}

/**
 * 商談データを取得
 */
export async function fetchDealsFromLark(): Promise<FetchResult<Deal>> {
  try {
    const records = await fetchBitableRecords(KENSHO_BITABLE_TABLES.deals);
    const deals = records.map(r => ({
      ...transformBitableToDeal(r),
      source: 'lark' as DataSource,
    }));
    return { data: deals, source: 'lark' };
  } catch (error) {
    return { data: [], source: 'lark', error: String(error) };
  }
}

export async function fetchDealsFromSheets(): Promise<FetchResult<Deal>> {
  try {
    const config = {
      spreadsheetId: process.env.NEXT_PUBLIC_GOOGLE_DEALS_SHEET_ID || '',
      sheetName: '商談一覧',
      range: 'A2:Z1000',
    };
    const rows = await fetchSheetData(config);
    const deals = rows.map((row, i) => ({
      ...transformSheetToDeal(row, i),
      source: 'sheets' as DataSource,
    }));
    return { data: deals, source: 'sheets' };
  } catch (error) {
    return { data: [], source: 'sheets', error: String(error) };
  }
}

export async function fetchDealsFromExcel(file: File): Promise<FetchResult<Deal>> {
  try {
    const { sheets } = await readExcelFile(file);
    const sheetData = sheets['商談一覧'] || sheets['deals'] || Object.values(sheets)[0];
    const deals = sheetData.map(row => ({
      ...transformExcelToDeal(row),
      source: 'excel' as DataSource,
    }));
    return { data: deals, source: 'excel' };
  } catch (error) {
    return { data: [], source: 'excel', error: String(error) };
  }
}

/**
 * 顧客データを取得
 */
export async function fetchCustomersFromLark(): Promise<FetchResult<Customer>> {
  try {
    const records = await fetchBitableRecords(KENSHO_BITABLE_TABLES.customers);
    const customers = records.map(r => ({
      ...transformBitableToCustomer(r),
      dataSource: 'lark' as DataSource,
    }));
    return { data: customers, source: 'lark' };
  } catch (error) {
    return { data: [], source: 'lark', error: String(error) };
  }
}

export async function fetchCustomersFromSheets(): Promise<FetchResult<Customer>> {
  try {
    const rows = await fetchSheetData(KENSHO_SHEETS.customers);
    const customers = rows.map((row, i) => ({
      ...transformSheetToCustomer(row, i),
      dataSource: 'sheets' as DataSource,
    }));
    return { data: customers, source: 'sheets' };
  } catch (error) {
    return { data: [], source: 'sheets', error: String(error) };
  }
}

export async function fetchCustomersFromExcel(file: File): Promise<FetchResult<Customer>> {
  try {
    const { sheets } = await readExcelFile(file);
    const sheetData = sheets['顧客一覧'] || sheets['customers'] || Object.values(sheets)[0];
    const customers = sheetData.map(row => ({
      ...transformExcelToCustomer(row),
      dataSource: 'excel' as DataSource,
    }));
    return { data: customers, source: 'excel' };
  } catch (error) {
    return { data: [], source: 'excel', error: String(error) };
  }
}

/**
 * 売上データを取得
 */
export async function fetchSalesFromSheets(): Promise<FetchResult<SalesRecord>> {
  try {
    const rows = await fetchSheetData(KENSHO_SHEETS.sales);
    const sales = rows.map((row, i) => ({
      ...transformSheetToSales(row, i),
      source: 'sheets' as DataSource,
    }));
    return { data: sales, source: 'sheets' };
  } catch (error) {
    return { data: [], source: 'sheets', error: String(error) };
  }
}

export async function fetchSalesFromExcel(file: File): Promise<FetchResult<SalesRecord>> {
  try {
    const { sheets } = await readExcelFile(file);
    const sheetData = sheets['売上一覧'] || sheets['sales'] || Object.values(sheets)[0];
    const sales = sheetData.map(row => ({
      ...transformExcelToSales(row),
      source: 'excel' as DataSource,
    }));
    return { data: sales, source: 'excel' };
  } catch (error) {
    return { data: [], source: 'excel', error: String(error) };
  }
}

/**
 * データストアを更新
 */
export function updateDataStore(
  type: 'projects' | 'deals' | 'customers' | 'sales',
  data: Project[] | Deal[] | Customer[] | SalesRecord[],
  source: DataSource
): void {
  (dataStore[type] as unknown[]) = data;
  dataStore.lastUpdated = new Date();
  dataStore.dataSource = source;
}

/**
 * データストアを取得
 */
export function getDataStore(): DataStore {
  return { ...dataStore };
}

/**
 * 手動入力データを追加
 */
export function addManualProject(project: Omit<Project, 'id' | 'source'>): Project {
  const newProject: Project = {
    ...project,
    id: `manual-${Date.now()}`,
    source: 'manual',
  };
  dataStore.projects.push(newProject);
  dataStore.lastUpdated = new Date();
  return newProject;
}

export function addManualDeal(deal: Omit<Deal, 'id' | 'source'>): Deal {
  const newDeal: Deal = {
    ...deal,
    id: `manual-${Date.now()}`,
    source: 'manual',
  };
  dataStore.deals.push(newDeal);
  dataStore.lastUpdated = new Date();
  return newDeal;
}

export function addManualCustomer(customer: Omit<Customer, 'id' | 'dataSource'>): Customer {
  const newCustomer: Customer = {
    ...customer,
    id: `manual-${Date.now()}`,
    dataSource: 'manual',
  };
  dataStore.customers.push(newCustomer);
  dataStore.lastUpdated = new Date();
  return newCustomer;
}

/**
 * Lark Bitableにデータを同期（書き込み）
 */
export async function syncProjectToLark(project: Project): Promise<void> {
  const fields = {
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

  if (project.source === 'lark' && project.id && !project.id.startsWith('manual-')) {
    // 既存レコードを更新
    await updateBitableRecord(KENSHO_BITABLE_TABLES.projects, project.id, fields);
  } else {
    // 新規レコードを作成
    await createBitableRecord(KENSHO_BITABLE_TABLES.projects, fields);
  }
}

/**
 * 全データソースから同期
 */
export async function syncAllData(preferredSource: DataSource = 'lark'): Promise<{
  success: boolean;
  errors: string[];
  stats: {
    projects: number;
    deals: number;
    customers: number;
    sales: number;
  };
}> {
  const errors: string[] = [];
  const stats = { projects: 0, deals: 0, customers: 0, sales: 0 };

  try {
    // プロジェクトデータ取得
    let projectResult: FetchResult<Project>;
    if (preferredSource === 'lark') {
      projectResult = await fetchProjectsFromLark();
    } else {
      projectResult = await fetchProjectsFromSheets();
    }
    if (projectResult.error) errors.push(`Projects: ${projectResult.error}`);
    else {
      updateDataStore('projects', projectResult.data, preferredSource);
      stats.projects = projectResult.data.length;
    }

    // 商談データ取得
    let dealResult: FetchResult<Deal>;
    if (preferredSource === 'lark') {
      dealResult = await fetchDealsFromLark();
    } else {
      dealResult = await fetchDealsFromSheets();
    }
    if (dealResult.error) errors.push(`Deals: ${dealResult.error}`);
    else {
      updateDataStore('deals', dealResult.data, preferredSource);
      stats.deals = dealResult.data.length;
    }

    // 顧客データ取得
    let customerResult: FetchResult<Customer>;
    if (preferredSource === 'lark') {
      customerResult = await fetchCustomersFromLark();
    } else {
      customerResult = await fetchCustomersFromSheets();
    }
    if (customerResult.error) errors.push(`Customers: ${customerResult.error}`);
    else {
      updateDataStore('customers', customerResult.data, preferredSource);
      stats.customers = customerResult.data.length;
    }

    // 売上データ取得（Sheets優先）
    const salesResult = await fetchSalesFromSheets();
    if (salesResult.error) errors.push(`Sales: ${salesResult.error}`);
    else {
      updateDataStore('sales', salesResult.data, 'sheets');
      stats.sales = salesResult.data.length;
    }

    return {
      success: errors.length === 0,
      errors,
      stats,
    };
  } catch (error) {
    return {
      success: false,
      errors: [String(error)],
      stats,
    };
  }
}
