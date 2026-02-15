
import { StatData, User, ChartDataPoint, Game, GameResult, JodiReport, Transaction } from './types';

export const DASHBOARD_STATS: StatData[] = [
  { label: 'Total Revenue', value: 'Rs 0', change: 0, trend: 'up', icon: 'DollarSign' },
  { label: 'Active Users', value: '1', change: 0, trend: 'up', icon: 'Users' },
  { label: 'Sales Growth', value: '0%', change: 0, trend: 'up', icon: 'TrendingUp' },
  { label: 'Conversion Rate', value: '0%', change: 0, trend: 'down', icon: 'Zap' },
];

export const REVENUE_CHART_DATA: ChartDataPoint[] = [
  { name: 'Jan', revenue: 0, users: 0 },
  { name: 'Feb', revenue: 0, users: 0 },
  { name: 'Mar', revenue: 0, users: 0 },
  { name: 'Apr', revenue: 0, users: 0 },
  { name: 'May', revenue: 0, users: 0 },
  { name: 'Jun', revenue: 0, users: 0 },
  { name: 'Jul', revenue: 0, users: 0 },
];

export const MOCK_USERS: User[] = [
  { 
    id: 'ADM001', 
    name: 'Master Admin', 
    mobile: '9876543210', 
    password: '1234', 
    role: 'Admin', 
    status: 'active', 
    lastActive: 'Just now', 
    points: 0,
    wallets: {
      deposit: 0,
      winner: 0,
      spin: 0,
      refer: 0,
      interest: 0
    }
  },
];

export const MOCK_GAMES: Game[] = [
  {
    id: 'G_INDIA_BAZAR',
    name: 'India Bazar',
    openTime: '09:00',
    closeTime: '08:00',
    resultTime: '08:30',
    activeDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    status: 'active'
  }
];

export const MOCK_RESULTS: GameResult[] = [];

export const MOCK_JODI_REPORT: JodiReport[] = Array.from({ length: 100 }, (_, i) => ({
  number: i.toString().padStart(2, '0'),
  amount: 0
}));

export const MOCK_DEPOSITS: Transaction[] = [];

export const MOCK_WITHDRAWALS: Transaction[] = [];
