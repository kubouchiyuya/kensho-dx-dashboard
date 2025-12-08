// 建匠100億プロジェクト - データ定義

export interface Deal {
  id: string;
  name: string;
  customer: string;
  salesRep: string;
  status: 'リード' | '初回面談' | '商談中' | '見積提出' | '契約準備' | '成約' | '失注';
  amount: number;
  probability: number;
  nextAction: string;
  nextDate: string;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  customerId: string;
  type: '新築' | 'リフォーム' | '外構' | '外装';
  contractAmount: number;
  estimatedCost: number;
  actualCost: number;
  grossMargin: number;
  marginRate: number;
  status: '商談中' | '契約済' | '着工前' | '進行中' | '竣工' | '完了';
  startDate: string;
  endDate: string;
  progress: number;
}

export interface Task {
  id: string;
  projectId: string;
  name: string;
  startDate: string;
  endDate: string;
  duration: number;
  progress: number;
  assignee: string;
  status: '未着手' | '進行中' | '完了' | '遅延';
  predecessor?: string;
}

export interface Alert {
  id: string;
  type: 'margin' | 'delay' | 'followup' | 'material';
  severity: 'info' | 'warning' | 'critical';
  title: string;
  message: string;
  projectId?: string;
  createdAt: string;
  isRead: boolean;
}

export interface KPI {
  label: string;
  value: number;
  previousValue: number;
  unit: string;
  trend: 'up' | 'down' | 'flat';
  target?: number;
}

// サンプルデータ
export const sampleDeals: Deal[] = [
  {
    id: 'KS-2024-001',
    name: '山田邸新築',
    customer: '山田太郎様',
    salesRep: '佐藤',
    status: '契約準備',
    amount: 35000000,
    probability: 95,
    nextAction: '契約書作成',
    nextDate: '2024-12-15',
    createdAt: '2024-10-01'
  },
  {
    id: 'KS-2024-002',
    name: '鈴木邸リフォーム',
    customer: '鈴木花子様',
    salesRep: '田中',
    status: '商談中',
    amount: 12000000,
    probability: 60,
    nextAction: '現地調査',
    nextDate: '2024-12-10',
    createdAt: '2024-11-05'
  },
  {
    id: 'KS-2024-003',
    name: '高橋邸新築',
    customer: '高橋次郎様',
    salesRep: '佐藤',
    status: '成約',
    amount: 42000000,
    probability: 100,
    nextAction: '着工準備',
    nextDate: '2024-12-20',
    createdAt: '2024-09-15'
  },
  {
    id: 'KS-2024-004',
    name: '伊藤邸外壁塗装',
    customer: '伊藤美咲様',
    salesRep: '山本',
    status: '見積提出',
    amount: 8000000,
    probability: 50,
    nextAction: '再訪問',
    nextDate: '2024-12-12',
    createdAt: '2024-11-20'
  },
  {
    id: 'KS-2024-005',
    name: '渡辺邸ガレージハウス',
    customer: '渡辺健一様',
    salesRep: '田中',
    status: '初回面談',
    amount: 50000000,
    probability: 30,
    nextAction: 'モデルハウス案内',
    nextDate: '2024-12-20',
    createdAt: '2024-12-01'
  },
  {
    id: 'KS-2024-006',
    name: '中村邸リノベ',
    customer: '中村一郎様',
    salesRep: '佐藤',
    status: 'リード',
    amount: 25000000,
    probability: 20,
    nextAction: '資料送付',
    nextDate: '2024-12-08',
    createdAt: '2024-12-05'
  }
];

export const sampleProjects: Project[] = [
  {
    id: 'P2024-001',
    name: '山田邸新築',
    customerId: 'C001',
    type: '新築',
    contractAmount: 35000000,
    estimatedCost: 28000000,
    actualCost: 6990000,
    grossMargin: 28010000,
    marginRate: 80.0,
    status: '進行中',
    startDate: '2024-12-01',
    endDate: '2025-04-25',
    progress: 25
  },
  {
    id: 'P2024-002',
    name: '鈴木邸リフォーム',
    customerId: 'C002',
    type: 'リフォーム',
    contractAmount: 12000000,
    estimatedCost: 9600000,
    actualCost: 1042500,
    grossMargin: 10957500,
    marginRate: 91.3,
    status: '進行中',
    startDate: '2024-11-20',
    endDate: '2025-02-28',
    progress: 15
  },
  {
    id: 'P2024-003',
    name: '高橋邸新築',
    customerId: 'C003',
    type: '新築',
    contractAmount: 42000000,
    estimatedCost: 33600000,
    actualCost: 0,
    grossMargin: 42000000,
    marginRate: 100,
    status: '着工前',
    startDate: '2025-01-15',
    endDate: '2025-06-30',
    progress: 0
  },
  {
    id: 'P2024-004',
    name: '伊藤邸外壁塗装',
    customerId: 'C004',
    type: '外装',
    contractAmount: 8000000,
    estimatedCost: 6000000,
    actualCost: 0,
    grossMargin: 8000000,
    marginRate: 100,
    status: '契約済',
    startDate: '2025-01-10',
    endDate: '2025-01-31',
    progress: 0
  }
];

export const sampleTasks: Task[] = [
  { id: 'T001', projectId: 'P2024-001', name: '設計完了', startDate: '2024-11-01', endDate: '2024-11-30', duration: 30, progress: 100, assignee: '設計部', status: '完了' },
  { id: 'T002', projectId: 'P2024-001', name: '確認申請', startDate: '2024-12-01', endDate: '2024-12-15', duration: 15, progress: 80, assignee: '設計部', status: '進行中', predecessor: 'T001' },
  { id: 'T003', projectId: 'P2024-001', name: '地盤調査', startDate: '2024-12-01', endDate: '2024-12-05', duration: 5, progress: 100, assignee: '外注', status: '完了', predecessor: 'T001' },
  { id: 'T004', projectId: 'P2024-001', name: '基礎工事', startDate: '2024-12-16', endDate: '2025-01-10', duration: 26, progress: 0, assignee: '現場A班', status: '未着手', predecessor: 'T002' },
  { id: 'T005', projectId: 'P2024-001', name: '上棟', startDate: '2025-01-15', endDate: '2025-01-20', duration: 6, progress: 0, assignee: '現場A班', status: '未着手', predecessor: 'T004' },
  { id: 'T006', projectId: 'P2024-001', name: '木工事', startDate: '2025-01-21', endDate: '2025-02-28', duration: 39, progress: 0, assignee: '現場A班', status: '未着手', predecessor: 'T005' },
  { id: 'T007', projectId: 'P2024-001', name: '外装工事', startDate: '2025-02-15', endDate: '2025-03-15', duration: 29, progress: 0, assignee: '現場B班', status: '未着手', predecessor: 'T006' },
  { id: 'T008', projectId: 'P2024-001', name: '内装工事', startDate: '2025-03-01', endDate: '2025-03-31', duration: 31, progress: 0, assignee: '内装班', status: '未着手', predecessor: 'T006' },
  { id: 'T009', projectId: 'P2024-001', name: '設備工事', startDate: '2025-03-15', endDate: '2025-04-10', duration: 27, progress: 0, assignee: '設備班', status: '未着手', predecessor: 'T008' },
  { id: 'T010', projectId: 'P2024-001', name: '竣工検査', startDate: '2025-04-15', endDate: '2025-04-20', duration: 6, progress: 0, assignee: '検査員', status: '未着手', predecessor: 'T009' },
  { id: 'T011', projectId: 'P2024-001', name: '引渡し', startDate: '2025-04-25', endDate: '2025-04-25', duration: 1, progress: 0, assignee: '営業', status: '未着手', predecessor: 'T010' }
];

export const sampleAlerts: Alert[] = [
  {
    id: 'A001',
    type: 'followup',
    severity: 'info',
    title: '商談フォローアップ',
    message: '鈴木花子様との現地調査予定日です',
    projectId: 'KS-2024-002',
    createdAt: '2024-12-08T09:00:00',
    isRead: false
  },
  {
    id: 'A002',
    type: 'delay',
    severity: 'warning',
    title: '工程遅延警告',
    message: '山田邸の確認申請が2日遅延しています',
    projectId: 'P2024-001',
    createdAt: '2024-12-08T08:30:00',
    isRead: false
  },
  {
    id: 'A003',
    type: 'material',
    severity: 'info',
    title: '材料価格変動',
    message: 'コンクリート単価が前月比3%上昇しました',
    createdAt: '2024-12-07T17:00:00',
    isRead: true
  }
];

export const sampleKPIs: KPI[] = [
  { label: '月間受注額', value: 147000000, previousValue: 125000000, unit: '円', trend: 'up', target: 150000000 },
  { label: '平均粗利率', value: 22.5, previousValue: 20.8, unit: '%', trend: 'up', target: 25 },
  { label: '進行中案件', value: 8, previousValue: 6, unit: '件', trend: 'up' },
  { label: '商談中案件', value: 12, previousValue: 10, unit: '件', trend: 'up' },
  { label: '今月完工予定', value: 3, previousValue: 2, unit: '件', trend: 'up' },
  { label: '遅延案件', value: 1, previousValue: 2, unit: '件', trend: 'down' }
];

// 売上推移データ（月別）
export const monthlySalesData = [
  { month: '7月', sales: 98000000, target: 100000000, grossProfit: 19600000 },
  { month: '8月', sales: 112000000, target: 110000000, grossProfit: 23520000 },
  { month: '9月', sales: 105000000, target: 115000000, grossProfit: 21000000 },
  { month: '10月', sales: 125000000, target: 120000000, grossProfit: 27500000 },
  { month: '11月', sales: 138000000, target: 130000000, grossProfit: 30360000 },
  { month: '12月', sales: 147000000, target: 150000000, grossProfit: 33075000 }
];

// パイプラインステージ別集計
export const pipelineData = [
  { stage: 'リード', count: 5, amount: 75000000, color: '#94a3b8' },
  { stage: '初回面談', count: 3, amount: 85000000, color: '#60a5fa' },
  { stage: '商談中', count: 4, amount: 68000000, color: '#34d399' },
  { stage: '見積提出', count: 2, amount: 30000000, color: '#fbbf24' },
  { stage: '契約準備', count: 2, amount: 55000000, color: '#f97316' },
  { stage: '成約', count: 8, amount: 280000000, color: '#22c55e' }
];

// 原価カテゴリ別
export const costCategoryData = [
  { category: '材料費', amount: 12500000, percentage: 45 },
  { category: '労務費', amount: 6900000, percentage: 25 },
  { category: '外注費', amount: 5500000, percentage: 20 },
  { category: '経費', amount: 2800000, percentage: 10 }
];

// ユーティリティ関数
export function formatCurrency(amount: number): string {
  if (amount >= 100000000) {
    return `${(amount / 100000000).toFixed(1)}億`;
  }
  if (amount >= 10000) {
    return `${(amount / 10000).toFixed(0)}万`;
  }
  return amount.toLocaleString();
}

export function formatFullCurrency(amount: number): string {
  return `¥${amount.toLocaleString()}`;
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    'リード': 'bg-slate-100 text-slate-700',
    '初回面談': 'bg-blue-100 text-blue-700',
    '商談中': 'bg-emerald-100 text-emerald-700',
    '見積提出': 'bg-amber-100 text-amber-700',
    '契約準備': 'bg-orange-100 text-orange-700',
    '成約': 'bg-green-100 text-green-700',
    '失注': 'bg-red-100 text-red-700',
    '未着手': 'bg-slate-100 text-slate-700',
    '進行中': 'bg-blue-100 text-blue-700',
    '完了': 'bg-green-100 text-green-700',
    '遅延': 'bg-red-100 text-red-700',
    '着工前': 'bg-slate-100 text-slate-700',
    '竣工': 'bg-emerald-100 text-emerald-700'
  };
  return colors[status] || 'bg-gray-100 text-gray-700';
}

export function getSeverityColor(severity: string): string {
  const colors: Record<string, string> = {
    'info': 'bg-blue-100 text-blue-700 border-blue-200',
    'warning': 'bg-amber-100 text-amber-700 border-amber-200',
    'critical': 'bg-red-100 text-red-700 border-red-200'
  };
  return colors[severity] || 'bg-gray-100 text-gray-700';
}
