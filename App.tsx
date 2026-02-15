
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import StatCard from './components/StatCard';
import DashboardCharts from './components/DashboardCharts';
import DataTable from './components/DataTable';
import AIInsights from './components/AIInsights';
import AddUserModal from './components/AddUserModal';
import EditUserPointsModal from './components/EditUserPointsModal';
import AddGameModal from './components/AddGameModal';
import AddResultModal from './components/AddResultModal';
import ReportPage from './components/ReportPage';
import SettingsPage from './components/SettingsPage';
import ChakkriControl from './components/ChakkriControl';
import InterestControl from './components/InterestControl';
import AddProduct from './components/AddProduct';
import TransactionQueue from './components/TransactionQueue';
import MemberPanel from './components/MemberPanel';
import AuthPage from './components/AuthPage';
import { DASHBOARD_STATS, MOCK_USERS, MOCK_GAMES, MOCK_RESULTS, MOCK_DEPOSITS, MOCK_WITHDRAWALS } from './constants';
import { LayoutDashboard, User as UserIcon, Smartphone } from 'lucide-react';
import { User, Game, GameResult, UserRole, Transaction, Bet, GameRates } from './types';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentRole, setCurrentRole] = useState<UserRole>('member');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [games, setGames] = useState<Game[]>(MOCK_GAMES);
  const [results, setResults] = useState<GameResult[]>(MOCK_RESULTS);
  const [transactions, setTransactions] = useState<Transaction[]>([...MOCK_DEPOSITS, ...MOCK_WITHDRAWALS]);
  const [bets, setBets] = useState<Bet[]>([]);
  const [gameRates, setGameRates] = useState<GameRates>({ 
    jodi: 90, 
    harup: 9,
    referralDepositPercentage: 5,
    referralBetPercentage: 1,
    downlineJoinBonusPercentage: 10
  });
  
  const [loggedInMemberId, setLoggedInMemberId] = useState('');
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isEditPointsModalOpen, setIsEditPointsModalOpen] = useState(false);
  const [selectedUserForEdit, setSelectedUserForEdit] = useState<User | null>(null);
  const [isAddGameModalOpen, setIsAddGameModalOpen] = useState(false);
  const [isAddResultModalOpen, setIsAddResultModalOpen] = useState(false);
  const [gameToEdit, setGameToEdit] = useState<Game | null>(null);
  const [urlReferCode, setUrlReferCode] = useState<string>('');

  useEffect(() => {
    // 1. Load saved rates
    const savedRates = localStorage.getItem('indra_game_rates');
    if (savedRates) setGameRates(JSON.parse(savedRates));

    // 2. Detect Referral Code from URL (Netlify friendly)
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    if (ref) {
      setUrlReferCode(ref);
      console.log("Live App: Referral detected:", ref);
    }
  }, []);

  const handleLogin = (role: UserRole, identifier: string, password?: string) => {
    if (role === 'admin') {
      setCurrentRole('admin');
      setIsAuthenticated(true);
    } else {
      const user = users.find(u => u.mobile === identifier);
      if (user) {
        if (user.password === password) {
          setLoggedInMemberId(user.id);
          setCurrentRole('member');
          setIsAuthenticated(true);
        } else {
          alert("Incorrect password!");
        }
      } else {
        alert("Member not found!");
      }
    }
  };

  const handleSignUp = (name: string, mobile: string, password: string, referCode: string) => {
    const existing = users.find(u => u.mobile === mobile);
    if (existing) {
      alert("Mobile number already registered!");
      return;
    }

    let referredBy: string | undefined = undefined;
    let baseBonus = 100;
    let totalJoinBonus = baseBonus;

    if (referCode && referCode.trim().length > 0) {
      const parentId = referCode.replace('INDRA-', '').trim();
      const parent = users.find(u => u.id.includes(parentId));
      if (parent) {
        referredBy = parent.id;
        const extra = (baseBonus * (gameRates.downlineJoinBonusPercentage || 10)) / 100;
        totalJoinBonus = baseBonus + extra;
      }
    }

    const randomId = Math.floor(1000 + Math.random() * 8999);
    const newMemberId = `MEM-${randomId}`;

    const newUser: User = {
      id: newMemberId,
      name,
      mobile,
      password,
      points: 0,
      role: 'Member',
      status: 'active',
      referredBy,
      lastActive: 'Just now',
      wallets: {
        deposit: totalJoinBonus, 
        winner: 0,
        spin: 0,
        refer: 0,
        interest: 0
      }
    };

    setUsers(prev => [newUser, ...prev]);
    setLoggedInMemberId(newUser.id);
    setCurrentRole('member');
    setIsAuthenticated(true);
    alert(`Account Created Successfully!\nYour ID: ${newMemberId}\nRs ${totalJoinBonus} bonus credited to your wallet.`);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setLoggedInMemberId('');
  };

  const handlePublishResult = (rd: any) => {
    const rawResult = rd.result.trim();
    const resultNum = rawResult.padStart(2, '0');
    const newResult: GameResult = {
      id: `R${Date.now()}`,
      ...rd,
      result: resultNum,
      createdAt: new Date().toLocaleString()
    };
    setResults(prev => [newResult, ...prev]);

    setBets(currentBets => {
      const pendingGameBets = currentBets.filter(b => b.gameId === rd.gameId && b.status === 'pending');
      const winnersMap: Record<string, number> = {};
      const updatedBetIds: Record<string, 'won' | 'lost'> = {};
      let totalPointsDistributed = 0;
      let winnerCount = 0;

      pendingGameBets.forEach(bet => {
        let isWin = false;
        let rate = 0;

        if (bet.type === 'jodi' && bet.number.padStart(2, '0') === resultNum) {
          isWin = true;
          rate = gameRates.jodi;
        } 
        else if (bet.type === 'harup-in' && resultNum.startsWith(bet.number)) {
          isWin = true;
          rate = gameRates.harup;
        }
        else if (bet.type === 'harup-out' && resultNum.endsWith(bet.number)) {
          isWin = true;
          rate = gameRates.harup;
        }

        if (isWin) {
          const winAmount = bet.amount * rate;
          winnersMap[bet.userId] = (winnersMap[bet.userId] || 0) + winAmount;
          updatedBetIds[bet.id] = 'won';
          totalPointsDistributed += winAmount;
          winnerCount++;
        } else {
          updatedBetIds[bet.id] = 'lost';
        }
      });

      setUsers(prevUsers => prevUsers.map(u => {
        if (winnersMap[u.id]) {
          return {
            ...u,
            wallets: { ...u.wallets, winner: u.wallets.winner + winnersMap[u.id] }
          };
        }
        return u;
      }));

      alert(`✅ Result Declared: ${resultNum}\n🏆 Winners: ${winnerCount}\n💰 Distributed: Rs ${totalPointsDistributed.toLocaleString()}`);
      return currentBets.map(b => updatedBetIds[b.id] ? { ...b, status: updatedBetIds[b.id] } : b);
    });
  };

  const handleAction = (id: string, newStatus: 'approved' | 'rejected') => {
    const tx = transactions.find(t => t.id === id);
    if (!tx) return;

    if (newStatus === 'approved') {
      setUsers(prevUsers => {
        const updatedUsers = [...prevUsers];
        const userIdx = updatedUsers.findIndex(u => u.id === tx.userId);
        
        if (userIdx !== -1) {
          const user = updatedUsers[userIdx];
          user.wallets.deposit += tx.amount;
          if (tx.type === 'deposit' && user.referredBy) {
            const parentIdx = updatedUsers.findIndex(u => u.id === user.referredBy);
            if (parentIdx !== -1) {
              const commission = (tx.amount * (gameRates.referralDepositPercentage || 5)) / 100;
              updatedUsers[parentIdx].wallets.refer += commission;
            }
          }
        }
        return updatedUsers;
      });
    } else if (newStatus === 'rejected' && tx.type === 'withdrawal') {
      setUsers(prevUsers => prevUsers.map(u => {
        if (u.id === tx.userId) {
          return { ...u, wallets: { ...u.wallets, winner: u.wallets.winner + tx.amount } };
        }
        return u;
      }));
    }
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
  };

  const handleAddMember = (newMemberData: any) => {
    const newUser: User = {
      id: newMemberData.memberId,
      name: newMemberData.name,
      mobile: newMemberData.mobile,
      password: newMemberData.password || '1234',
      points: 0,
      wallets: {
        deposit: newMemberData.points || 0,
        winner: 0,
        spin: 0,
        refer: 0,
        interest: 0
      },
      role: 'Member',
      status: 'active',
      lastActive: 'Just now'
    };
    setUsers(prev => [newUser, ...prev]);
  };

  const handleUpdateUserPointsAndPassword = (userId: string, updates: { password?: string; pointsAdjustment: number }) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return {
          ...u,
          password: updates.password !== undefined ? updates.password : u.password,
          wallets: {
            ...u.wallets,
            deposit: u.wallets.deposit + updates.pointsAdjustment
          }
        };
      }
      return u;
    }));
  };

  const handleMemberUpdateProfile = (userId: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updates } : u));
  };

  const handleMemberAddTransaction = (tx: Partial<Transaction>) => {
    const newTx: Transaction = {
      id: `${tx.type === 'deposit' ? 'DEP' : 'WTH'}${Date.now()}`,
      userId: loggedInMemberId,
      userName: users.find(u => u.id === loggedInMemberId)?.name || 'Member',
      amount: tx.amount || 0,
      type: tx.type as 'deposit' | 'withdrawal',
      method: tx.method || 'UPI',
      status: 'pending',
      createdAt: new Date().toLocaleString(),
      screenshot: tx.screenshot,
      reference: tx.reference,
      paymentDetails: tx.paymentDetails
    };
    setTransactions(prev => [newTx, ...prev]);
  };

  const handleMemberPlaceBet = (gameId: string, numbers: string[], amountPerNumber: number, type: string) => {
    const user = users.find(u => u.id === loggedInMemberId);
    const game = games.find(g => g.id === gameId);
    if (!user || !game) return;

    const totalAmount = numbers.length * amountPerNumber;
    const newBets: Bet[] = numbers.map(num => ({
      id: `BET-${Date.now()}-${Math.random()}`,
      userId: user.id,
      userName: user.name,
      userMobile: user.mobile,
      gameId: game.id,
      gameName: game.name,
      number: num,
      amount: amountPerNumber,
      type,
      createdAt: new Date().toLocaleString(),
      status: 'pending'
    }));

    setBets(prev => [...prev, ...newBets]);
    
    let remaining = totalAmount;
    const newWallets = { ...user.wallets };
    const priority: (keyof typeof newWallets)[] = ['deposit', 'winner', 'spin', 'refer', 'interest'];
    for (const key of priority) {
      if (remaining <= 0) break;
      const deduct = Math.min(newWallets[key], remaining);
      newWallets[key] -= deduct;
      remaining -= deduct;
    }
    
    setUsers(prevUsers => {
      const updated = [...prevUsers];
      const uIdx = updated.findIndex(u => u.id === user.id);
      if (uIdx !== -1) {
        updated[uIdx].wallets = newWallets;
        if (updated[uIdx].referredBy) {
          const parentIdx = updated.findIndex(p => p.id === updated[uIdx].referredBy);
          if (parentIdx !== -1) {
            const commission = (totalAmount * (gameRates.referralBetPercentage || 1)) / 100;
            updated[parentIdx].wallets.refer += commission;
          }
        }
      }
      return updated;
    });
  };

  const handleBlockUser = (user: User) => {
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, status: newStatus as any } : u));
  };

  const handleDeleteUser = (user: User) => {
    if (window.confirm(`Delete user ${user.name}?`)) {
      setUsers(prev => prev.filter(u => u.id !== user.id));
    }
  };

  const getPageTitle = () => {
    const menuItems = [
      { id: 'dashboard', label: 'Dashboard' },
      { id: 'users', label: 'Manage Users' },
      { id: 'products', label: 'Store Manager' },
      { id: 'deposits', label: 'Deposit Queue' },
      { id: 'withdrawals', label: 'Withdrawal Queue' },
      { id: 'interest', label: 'ROI Engine' },
      { id: 'chakkri', label: 'Spin Controller' },
      { id: 'game', label: 'Markets' },
      { id: 'result', label: 'Results' },
      { id: 'report', label: 'Analytics' },
      { id: 'settings', label: 'Settings' },
    ];
    return menuItems.find(item => item.id === activeTab)?.label || 'Indra Market Terminal';
  };

  if (!isAuthenticated) return <AuthPage initialReferCode={urlReferCode} onLogin={handleLogin} onSignUp={handleSignUp} />;

  if (currentRole === 'member') {
    const currentMember = users.find(u => u.id === loggedInMemberId) || users[0];
    return (
      <MemberPanel 
        games={games} 
        results={results}
        member={currentMember}
        transactions={transactions}
        onUpdateProfile={(updates) => handleMemberUpdateProfile(loggedInMemberId, updates)}
        onAddTransaction={handleMemberAddTransaction}
        onPlaceBetDetailed={handleMemberPlaceBet}
        onLogout={handleLogout}
        gameRates={gameRates}
      />
    );
  }

  return (
    <div className="min-h-screen flex bg-slate-50">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} activeTab={activeTab} setActiveTab={setActiveTab} />
      <AddUserModal isOpen={isAddUserModalOpen} onClose={() => setIsAddUserModalOpen(false)} onAdd={handleAddMember} />
      <EditUserPointsModal isOpen={isEditPointsModalOpen} onClose={() => { setIsEditPointsModalOpen(false); setSelectedUserForEdit(null); }} user={selectedUserForEdit} onUpdate={handleUpdateUserPointsAndPassword} />
      <AddGameModal isOpen={isAddGameModalOpen} onClose={() => {setIsAddGameModalOpen(false); setGameToEdit(null);}} onAdd={(gd)=> setGames(prev => gd.id ? prev.map(g => g.id === gd.id ? {...g, ...gd}:g) : [...prev, {id: `G${Date.now()}`, ...gd, status: 'active'}])} initialData={gameToEdit} />
      <AddResultModal isOpen={isAddResultModalOpen} onClose={() => setIsAddResultModalOpen(false)} onAdd={handlePublishResult} games={games} />
      <main className={`flex-1 transition-all duration-500 ${sidebarOpen ? 'ml-72' : 'ml-24'}`}>
        <Navbar sidebarOpen={sidebarOpen} onLogout={handleLogout} />
        <div className="pt-24 px-8 pb-12 max-w-[1600px] mx-auto">
          <div className="flex flex-col gap-8">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-1"><LayoutDashboard size={12} /> Live Management</div>
                <h1 className="text-4xl font-black text-slate-950 tracking-tighter uppercase">{getPageTitle()}</h1>
              </div>
              <div className="flex items-center gap-4">
                 <div className="hidden md:flex flex-col text-right mr-4">
                    <span className="text-[10px] font-black text-emerald-500 uppercase">Server Status</span>
                    <span className="text-xs font-bold text-slate-400">Netlify Live Active</span>
                 </div>
                <button onClick={() => setCurrentRole('member')} className="group flex items-center gap-3 px-6 py-4 bg-white border border-slate-200 text-slate-900 font-black text-xs uppercase tracking-widest rounded-2xl shadow-sm hover:bg-slate-50 transition-all"><UserIcon size={18} /> Player Terminal</button>
              </div>
            </header>
            {activeTab === 'dashboard' && (
              <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 space-y-10">
                <AIInsights />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {DASHBOARD_STATS.map((stat, idx) => <StatCard key={idx} {...stat} />)}
                </div>
                <DashboardCharts />
                <DataTable users={users} onEditUser={(u) => { setSelectedUserForEdit(u); setIsEditPointsModalOpen(true); }} onBlockUser={handleBlockUser} onDeleteUser={handleDeleteUser} />
              </div>
            )}
            {activeTab === 'users' && <DataTable users={users} onEditUser={(u) => { setSelectedUserForEdit(u); setIsEditPointsModalOpen(true); }} onBlockUser={handleBlockUser} onDeleteUser={handleDeleteUser} />}
            {activeTab === 'products' && <AddProduct />}
            {activeTab === 'deposits' && <TransactionQueue type="deposit" transactions={transactions.filter(t => t.type === 'deposit')} onAction={handleAction} />}
            {activeTab === 'withdrawals' && <TransactionQueue type="withdrawal" transactions={transactions.filter(t => t.type === 'withdrawal')} onAction={handleAction} />}
            {activeTab === 'report' && <ReportPage games={games} bets={bets} />}
            {activeTab === 'settings' && <SettingsPage rates={gameRates} onUpdateRates={(r) => { setGameRates(r); localStorage.setItem('indra_game_rates', JSON.stringify(r)); }} />}
            {activeTab === 'chakkri' && <ChakkriControl />}
            {activeTab === 'interest' && <InterestControl />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
