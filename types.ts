
export type UserRole = 'admin' | 'member';

export interface StatData {
  label: string;
  value: string;
  change: number;
  trend: 'up' | 'down';
  icon: string;
}

export interface User {
  id: string;
  name: string;
  email?: string;
  mobile: string;
  password?: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  lastActive: string;
  points: number; 
  avatar?: string; // Added avatar field for profile picture
  referredBy?: string; // ID of the user who referred this user
  wallets: {
    deposit: number;
    winner: number;
    spin: number;
    refer: number;
    interest: number;
  };
}

export interface GameRates {
  jodi: number;
  harup: number;
  referralDepositPercentage: number; // % of downline's deposit
  referralBetPercentage: number;     // % of downline's bet
  downlineJoinBonusPercentage: number; // % extra bonus for joining via refer link
}

export interface Bet {
  id: string;
  userId: string;
  userName: string;
  userMobile: string;
  gameId: string;
  gameName: string;
  number: string;
  amount: number;
  type: string;
  createdAt: string;
  status?: 'pending' | 'won' | 'lost';
}

export interface Game {
  id: string;
  name: string;
  openTime: string;
  closeTime: string;
  resultTime: string;
  activeDays: string[];
  status: 'active' | 'disabled';
}

export interface GameResult {
  id: string;
  gameId: string;
  gameName: string;
  date: string;
  result: string;
  createdAt: string;
}

export interface JodiReport {
  number: string;
  amount: number;
}

export interface ChartDataPoint {
  name: string;
  revenue: number;
  users: number;
}

export interface Transaction {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  type: 'deposit' | 'withdrawal';
  method: string;
  reference?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  screenshot?: string;
  paymentDetails?: string;
}
