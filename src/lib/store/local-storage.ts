/**
 * ローカルストレージ データ管理
 *
 * ブラウザのlocalStorageを使用してデータを永続化
 * API接続前でも実データで動作可能
 */

// データ型定義
export interface Project {
  id: string;
  name: string;
  customer: string;
  type: '新築' | 'リフォーム' | '外壁塗装' | '外構' | 'その他';
  status: '見込み' | '契約済' | '着工前' | '進行中' | '竣工' | '完了';
  contractAmount: number;
  estimatedCost: number;
  actualCost: number;
  startDate: string;
  endDate: string;
  progress: number;
  salesRep: string;
  address?: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Deal {
  id: string;
  name: string;
  customer: string;
  customerId?: string;
  amount: number;
  probability: number;
  status: 'リード' | '初回面談' | '商談中' | '見積提出' | '契約準備' | '成約' | '失注';
  salesRep: string;
  nextAction: string;
  nextDate: string;
  source?: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  name: string;
  nameKana?: string;
  company?: string;
  email: string;
  phone: string;
  address: string;
  postalCode?: string;
  status: 'リード' | 'アクティブ' | '契約中' | '完了' | '休眠';
  source: 'HP問い合わせ' | '紹介' | 'チラシ' | '展示場' | 'SNS' | 'その他';
  totalAmount: number;
  lastContact: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CostRecord {
  id: string;
  projectId: string;
  projectName: string;
  category: '材料費' | '人件費' | '外注費' | '諸経費' | 'その他';
  vendor: string;
  description: string;
  estimatedAmount: number;
  actualAmount: number;
  date: string;
  isPaid: boolean;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SalesRecord {
  id: string;
  date: string;
  projectId?: string;
  projectName: string;
  customer: string;
  amount: number;
  type: '契約金' | '中間金' | '完工金' | 'その他';
  salesRep: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

// ストレージキー
const STORAGE_KEYS = {
  projects: 'kensho_projects',
  deals: 'kensho_deals',
  customers: 'kensho_customers',
  costs: 'kensho_costs',
  sales: 'kensho_sales',
  settings: 'kensho_settings',
} as const;

// ユーティリティ
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function getTimestamp(): string {
  return new Date().toISOString();
}

// ジェネリック CRUD 関数
function getAll<T>(key: string): T[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}

function saveAll<T>(key: string, data: T[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(data));
}

function getById<T extends { id: string }>(key: string, id: string): T | null {
  const items = getAll<T>(key);
  return items.find(item => item.id === id) || null;
}

function create<T extends { id: string; createdAt: string; updatedAt: string }>(
  key: string,
  data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>
): T {
  const items = getAll<T>(key);
  const newItem = {
    ...data,
    id: generateId(),
    createdAt: getTimestamp(),
    updatedAt: getTimestamp(),
  } as T;
  items.push(newItem);
  saveAll(key, items);
  return newItem;
}

function update<T extends { id: string; updatedAt: string }>(
  key: string,
  id: string,
  data: Partial<T>
): T | null {
  const items = getAll<T>(key);
  const index = items.findIndex(item => item.id === id);
  if (index === -1) return null;

  items[index] = {
    ...items[index],
    ...data,
    updatedAt: getTimestamp(),
  };
  saveAll(key, items);
  return items[index];
}

function remove<T extends { id: string }>(key: string, id: string): boolean {
  const items = getAll<T>(key);
  const filtered = items.filter(item => item.id !== id);
  if (filtered.length === items.length) return false;
  saveAll(key, filtered);
  return true;
}

// ========================================
// Projects API
// ========================================
export const projectsStore = {
  getAll: (): Project[] => getAll<Project>(STORAGE_KEYS.projects),

  getById: (id: string): Project | null =>
    getById<Project>(STORAGE_KEYS.projects, id),

  create: (data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Project =>
    create<Project>(STORAGE_KEYS.projects, data),

  update: (id: string, data: Partial<Project>): Project | null =>
    update<Project>(STORAGE_KEYS.projects, id, data),

  delete: (id: string): boolean =>
    remove<Project>(STORAGE_KEYS.projects, id),

  // 集計
  getTotalContractAmount: (): number => {
    return projectsStore.getAll().reduce((sum, p) => sum + p.contractAmount, 0);
  },

  getTotalEstimatedCost: (): number => {
    return projectsStore.getAll().reduce((sum, p) => sum + p.estimatedCost, 0);
  },

  getByStatus: (status: Project['status']): Project[] => {
    return projectsStore.getAll().filter(p => p.status === status);
  },
};

// ========================================
// Deals API
// ========================================
export const dealsStore = {
  getAll: (): Deal[] => getAll<Deal>(STORAGE_KEYS.deals),

  getById: (id: string): Deal | null =>
    getById<Deal>(STORAGE_KEYS.deals, id),

  create: (data: Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>): Deal =>
    create<Deal>(STORAGE_KEYS.deals, data),

  update: (id: string, data: Partial<Deal>): Deal | null =>
    update<Deal>(STORAGE_KEYS.deals, id, data),

  delete: (id: string): boolean =>
    remove<Deal>(STORAGE_KEYS.deals, id),

  // パイプライン集計
  getByStatus: (status: Deal['status']): Deal[] => {
    return dealsStore.getAll().filter(d => d.status === status);
  },

  getPipelineSummary: () => {
    const deals = dealsStore.getAll();
    const statuses: Deal['status'][] = ['リード', '初回面談', '商談中', '見積提出', '契約準備', '成約'];
    return statuses.map(status => {
      const stageDeals = deals.filter(d => d.status === status);
      return {
        status,
        count: stageDeals.length,
        amount: stageDeals.reduce((sum, d) => sum + d.amount, 0),
        weightedAmount: stageDeals.reduce((sum, d) => sum + d.amount * d.probability / 100, 0),
      };
    });
  },
};

// ========================================
// Customers API
// ========================================
export const customersStore = {
  getAll: (): Customer[] => getAll<Customer>(STORAGE_KEYS.customers),

  getById: (id: string): Customer | null =>
    getById<Customer>(STORAGE_KEYS.customers, id),

  create: (data: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>): Customer =>
    create<Customer>(STORAGE_KEYS.customers, data),

  update: (id: string, data: Partial<Customer>): Customer | null =>
    update<Customer>(STORAGE_KEYS.customers, id, data),

  delete: (id: string): boolean =>
    remove<Customer>(STORAGE_KEYS.customers, id),

  getByStatus: (status: Customer['status']): Customer[] => {
    return customersStore.getAll().filter(c => c.status === status);
  },

  search: (query: string): Customer[] => {
    const q = query.toLowerCase();
    return customersStore.getAll().filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      c.address.toLowerCase().includes(q)
    );
  },
};

// ========================================
// Costs API
// ========================================
export const costsStore = {
  getAll: (): CostRecord[] => getAll<CostRecord>(STORAGE_KEYS.costs),

  getById: (id: string): CostRecord | null =>
    getById<CostRecord>(STORAGE_KEYS.costs, id),

  create: (data: Omit<CostRecord, 'id' | 'createdAt' | 'updatedAt'>): CostRecord =>
    create<CostRecord>(STORAGE_KEYS.costs, data),

  update: (id: string, data: Partial<CostRecord>): CostRecord | null =>
    update<CostRecord>(STORAGE_KEYS.costs, id, data),

  delete: (id: string): boolean =>
    remove<CostRecord>(STORAGE_KEYS.costs, id),

  getByProject: (projectId: string): CostRecord[] => {
    return costsStore.getAll().filter(c => c.projectId === projectId);
  },

  getByCategory: (category: CostRecord['category']): CostRecord[] => {
    return costsStore.getAll().filter(c => c.category === category);
  },

  getCategorySummary: () => {
    const costs = costsStore.getAll();
    const categories: CostRecord['category'][] = ['材料費', '人件費', '外注費', '諸経費', 'その他'];
    return categories.map(category => {
      const categoryCosts = costs.filter(c => c.category === category);
      return {
        category,
        estimated: categoryCosts.reduce((sum, c) => sum + c.estimatedAmount, 0),
        actual: categoryCosts.reduce((sum, c) => sum + c.actualAmount, 0),
      };
    });
  },
};

// ========================================
// Sales API
// ========================================
export const salesStore = {
  getAll: (): SalesRecord[] => getAll<SalesRecord>(STORAGE_KEYS.sales),

  getById: (id: string): SalesRecord | null =>
    getById<SalesRecord>(STORAGE_KEYS.sales, id),

  create: (data: Omit<SalesRecord, 'id' | 'createdAt' | 'updatedAt'>): SalesRecord =>
    create<SalesRecord>(STORAGE_KEYS.sales, data),

  update: (id: string, data: Partial<SalesRecord>): SalesRecord | null =>
    update<SalesRecord>(STORAGE_KEYS.sales, id, data),

  delete: (id: string): boolean =>
    remove<SalesRecord>(STORAGE_KEYS.sales, id),

  getByDateRange: (startDate: string, endDate: string): SalesRecord[] => {
    return salesStore.getAll().filter(s => s.date >= startDate && s.date <= endDate);
  },

  getMonthlySummary: () => {
    const sales = salesStore.getAll();
    const monthly: Record<string, number> = {};

    sales.forEach(s => {
      const month = s.date.substring(0, 7); // YYYY-MM
      monthly[month] = (monthly[month] || 0) + s.amount;
    });

    return Object.entries(monthly)
      .map(([month, amount]) => ({ month, amount }))
      .sort((a, b) => a.month.localeCompare(b.month));
  },
};

// ========================================
// データエクスポート/インポート
// ========================================
export function exportAllData(): string {
  const data = {
    projects: projectsStore.getAll(),
    deals: dealsStore.getAll(),
    customers: customersStore.getAll(),
    costs: costsStore.getAll(),
    sales: salesStore.getAll(),
    exportedAt: getTimestamp(),
  };
  return JSON.stringify(data, null, 2);
}

export function importAllData(jsonString: string): {
  success: boolean;
  counts: Record<string, number>;
  error?: string;
} {
  try {
    const data = JSON.parse(jsonString);

    if (data.projects) saveAll(STORAGE_KEYS.projects, data.projects);
    if (data.deals) saveAll(STORAGE_KEYS.deals, data.deals);
    if (data.customers) saveAll(STORAGE_KEYS.customers, data.customers);
    if (data.costs) saveAll(STORAGE_KEYS.costs, data.costs);
    if (data.sales) saveAll(STORAGE_KEYS.sales, data.sales);

    return {
      success: true,
      counts: {
        projects: data.projects?.length || 0,
        deals: data.deals?.length || 0,
        customers: data.customers?.length || 0,
        costs: data.costs?.length || 0,
        sales: data.sales?.length || 0,
      },
    };
  } catch (error) {
    return {
      success: false,
      counts: {},
      error: String(error),
    };
  }
}

// ========================================
// デモデータ生成
// ========================================
export function loadDemoData(): void {
  // 既存データがあればスキップ
  if (projectsStore.getAll().length > 0) return;

  // デモプロジェクト
  const demoProjects: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>[] = [
    {
      name: '山田邸新築工事',
      customer: '山田太郎',
      type: '新築',
      status: '進行中',
      contractAmount: 35000000,
      estimatedCost: 28000000,
      actualCost: 15000000,
      startDate: '2024-10-01',
      endDate: '2025-03-31',
      progress: 45,
      salesRep: '佐藤一郎',
      address: '高知市〇〇町1-2-3',
    },
    {
      name: '鈴木邸リフォーム',
      customer: '鈴木花子',
      type: 'リフォーム',
      status: '契約済',
      contractAmount: 8000000,
      estimatedCost: 6000000,
      actualCost: 0,
      startDate: '2025-01-15',
      endDate: '2025-02-28',
      progress: 0,
      salesRep: '田中次郎',
      address: '高知市△△町4-5-6',
    },
    {
      name: '高橋邸外壁塗装',
      customer: '高橋一郎',
      type: '外壁塗装',
      status: '進行中',
      contractAmount: 2500000,
      estimatedCost: 1800000,
      actualCost: 1200000,
      startDate: '2024-11-01',
      endDate: '2024-12-15',
      progress: 70,
      salesRep: '佐藤一郎',
      address: '南国市□□町7-8-9',
    },
  ];

  // デモ商談
  const demoDeals: Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>[] = [
    {
      name: '渡辺邸新築相談',
      customer: '渡辺健二',
      amount: 40000000,
      probability: 60,
      status: '商談中',
      salesRep: '佐藤一郎',
      nextAction: 'モデルハウス案内',
      nextDate: '2024-12-15',
      source: 'HP問い合わせ',
    },
    {
      name: '伊藤邸リフォーム見積',
      customer: '伊藤美咲',
      amount: 5000000,
      probability: 80,
      status: '見積提出',
      salesRep: '田中次郎',
      nextAction: '見積回答待ち',
      nextDate: '2024-12-10',
      source: '紹介',
    },
    {
      name: '佐々木邸外構工事',
      customer: '佐々木大輔',
      amount: 3000000,
      probability: 40,
      status: '初回面談',
      salesRep: '佐藤一郎',
      nextAction: '現地調査',
      nextDate: '2024-12-12',
      source: 'チラシ',
    },
  ];

  // デモ顧客
  const demoCustomers: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>[] = [
    {
      name: '山田太郎',
      nameKana: 'ヤマダタロウ',
      email: 'yamada@example.com',
      phone: '090-1234-5678',
      address: '高知市〇〇町1-2-3',
      postalCode: '780-0001',
      status: '契約中',
      source: 'HP問い合わせ',
      totalAmount: 35000000,
      lastContact: '2024-12-05',
    },
    {
      name: '鈴木花子',
      nameKana: 'スズキハナコ',
      email: 'suzuki@example.com',
      phone: '090-2345-6789',
      address: '高知市△△町4-5-6',
      postalCode: '780-0002',
      status: '契約中',
      source: '紹介',
      totalAmount: 8000000,
      lastContact: '2024-12-01',
    },
    {
      name: '渡辺健二',
      nameKana: 'ワタナベケンジ',
      email: 'watanabe@example.com',
      phone: '090-3456-7890',
      address: '高知市◇◇町10-11-12',
      postalCode: '780-0003',
      status: 'アクティブ',
      source: 'HP問い合わせ',
      totalAmount: 0,
      lastContact: '2024-12-07',
    },
  ];

  // データ保存
  demoProjects.forEach(p => projectsStore.create(p));
  demoDeals.forEach(d => dealsStore.create(d));
  demoCustomers.forEach(c => customersStore.create(c));
}
