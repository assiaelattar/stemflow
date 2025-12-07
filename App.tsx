import React, { useState, useEffect, createContext, useContext } from 'react';
import { HashRouter, Routes, Route, Link, useParams, Navigate, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { AppContextType, MenuItem, Order, Table, Booking, ChatMessage, OrderStatus, Tenant, SaaSModule } from './types';
import { dbService } from './services/mockDb';
import { KitchenDisplay } from './components/KitchenDisplay';
import { MenuManager } from './components/MenuManager';
import { ClientApp } from './components/ClientApp';
import { SuperAdminDashboard } from './components/SuperAdminDashboard';
import { LayoutDashboard, Utensils, Layout, QrCode, Calendar, MessageSquare, Menu as MenuIcon, X, LogOut, Flame, Shield, Lock } from 'lucide-react';

// Context definition
const AppContext = createContext<AppContextType | null>(null);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext must be used within AppProvider");
  return context;
};

// --- Security Components ---

// Guard for Modules (e.g., if Tenant hasn't bought Kitchen Display)
const ModuleGuard: React.FC<{ module: SaaSModule, children: React.ReactNode }> = ({ module, children }) => {
  const { currentTenant } = useAppContext();
  
  if (!currentTenant) return <Navigate to="/" />;

  if (!currentTenant.activeModules.includes(module) && module !== SaaSModule.POS) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-neutral-400 p-8 text-center">
        <div className="bg-[#1f1f1f] p-6 rounded-full mb-6">
           <Lock size={48} className="text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Module Not Available</h2>
        <p className="max-w-md mb-6">
          The <strong>{module.replace('_', ' ')}</strong> module is not active for <strong>{currentTenant.name}</strong>.
        </p>
        <p className="text-sm bg-red-500/10 text-red-400 px-4 py-2 rounded-xl border border-red-500/20">
          Contact your SaaS administrator to upgrade your subscription.
        </p>
      </div>
    );
  }

  return <>{children}</>;
};

// ---------------------------

// Admin Sidebar
const AdminSidebar: React.FC<{ isOpen: boolean, setIsOpen: (v: boolean) => void }> = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const { currentTenant } = useAppContext();

  const isActive = (path: string) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  // Dynamically filter navigation based on tenant modules
  const navItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', module: SaaSModule.POS },
    { path: '/admin/menu', icon: Utensils, label: 'Menu Catalog', module: SaaSModule.POS },
    { path: '/admin/tables', icon: QrCode, label: 'Tables & QR', module: SaaSModule.QR_MENU },
    { path: '/admin/bookings', icon: Calendar, label: 'Reservations', module: SaaSModule.TABLE_BOOKING },
    { path: '/admin/kitchen', icon: Layout, label: 'Kitchen View', module: SaaSModule.KITCHEN_DISPLAY },
    { path: '/admin/chats', icon: MessageSquare, label: 'Live Chats', module: SaaSModule.LIVE_CHAT },
  ];

  const visibleNavItems = navItems.filter(item => 
    item.module === SaaSModule.POS || currentTenant?.activeModules.includes(item.module)
  );

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 md:hidden" onClick={() => setIsOpen(false)} />
      )}
      
      {/* Sidebar */}
      <div className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-[#1f1f1f] text-white flex flex-col transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 border-r border-neutral-800`}>
        <div className="p-8 flex items-center gap-3">
          <div className="bg-red-500 p-2 rounded-xl shadow-lg shadow-red-500/20">
            <Flame className="text-white fill-white" size={24} />
          </div>
          <div>
             <h1 className="text-xl font-bold tracking-tight">RestoFlow</h1>
             <p className="text-neutral-500 text-[10px] uppercase font-bold tracking-widest">Enterprise</p>
          </div>
          <button className="md:hidden ml-auto" onClick={() => setIsOpen(false)}><X/></button>
        </div>

        <div className="px-6 mb-2">
           <div className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Restaurant</div>
           <div className="font-bold text-white truncate">{currentTenant?.name}</div>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {visibleNavItems.map((item) => (
            <Link 
              key={item.path}
              to={item.path} 
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-200 group ${
                isActive(item.path) 
                ? 'bg-red-500 text-white shadow-lg shadow-red-500/20 translate-x-2' 
                : 'text-neutral-400 hover:bg-[#2d2d2d] hover:text-white'
              }`}
            >
              <item.icon size={20} className={isActive(item.path) ? 'stroke-2' : 'stroke-[1.5]'}/> 
              <span className="font-medium text-sm">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-6 mt-auto">
          <Link to="/super-admin" className="flex items-center gap-3 text-neutral-500 hover:text-white transition px-2 mb-4">
             <Shield size={18} /> <span className="text-sm font-medium">SaaS Admin</span>
          </Link>
          <Link to="/" className="flex items-center gap-3 text-neutral-500 hover:text-red-500 transition px-2">
            <LogOut size={18} /> <span className="text-sm font-medium">Logout</span>
          </Link>
        </div>
      </div>
    </>
  );
};

// Admin Layout
const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { currentTenant } = useAppContext();

  if (!currentTenant) return <Navigate to="/" />;

  return (
    <div className="flex bg-[#121212] min-h-screen text-neutral-100">
      <AdminSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <div className="md:hidden p-4 bg-[#1f1f1f] flex items-center justify-between border-b border-neutral-800 flex-shrink-0">
          <div className="flex items-center gap-2">
             <div className="bg-red-500 p-1.5 rounded-lg"><Flame size={18} className="text-white fill-white"/></div>
             <span className="font-bold">{currentTenant.name}</span>
          </div>
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-white"><MenuIcon /></button>
        </div>
        
        {/* Main Content with Outlet for Route Nesting */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto h-full">
             <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

// Admin Dashboard Component
const AdminDashboard = () => {
  const { orders, tables, menu, currentTenant } = useAppContext();
  
  return (
    <>
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-white">Dashboard</h2>
            <p className="text-neutral-400 mt-1">Overview for {currentTenant?.name}</p>
          </div>
          <div className="bg-[#1f1f1f] rounded-full p-1 pl-4 flex items-center gap-2 border border-neutral-800">
             <span className="text-sm text-neutral-400">Search...</span>
             <button className="bg-red-500 p-2 rounded-full text-white"><LayoutDashboard size={16}/></button>
          </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
         <div className="bg-[#1f1f1f] p-6 rounded-3xl shadow-sm border border-neutral-800 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-3xl -mr-16 -mt-16 transition group-hover:bg-red-500/20"></div>
            <div className="text-neutral-400 text-sm font-bold uppercase tracking-wider mb-2">Total Orders</div>
            <div className="text-4xl font-bold text-white">{orders.length}</div>
            <div className="text-green-500 text-sm font-medium mt-2 flex items-center gap-1">
              <span>+12%</span> <span className="text-neutral-500">from yesterday</span>
            </div>
         </div>
         <div className="bg-[#1f1f1f] p-6 rounded-3xl shadow-sm border border-neutral-800 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl -mr-16 -mt-16 transition group-hover:bg-orange-500/20"></div>
            <div className="text-neutral-400 text-sm font-bold uppercase tracking-wider mb-2">Active Tables</div>
            <div className="text-4xl font-bold text-white">{tables.filter(t => t.status === 'OCCUPIED').length}/{tables.length}</div>
            <div className="text-neutral-500 text-sm font-medium mt-2">
              Currently seated
            </div>
         </div>
         <div className="bg-[#1f1f1f] p-6 rounded-3xl shadow-sm border border-neutral-800 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -mr-16 -mt-16 transition group-hover:bg-purple-500/20"></div>
            <div className="text-neutral-400 text-sm font-bold uppercase tracking-wider mb-2">Revenue</div>
            <div className="text-4xl font-bold text-white">1,240 MAD</div>
            <div className="text-green-500 text-sm font-medium mt-2 flex items-center gap-1">
              <span>+8%</span> <span className="text-neutral-500">vs last week</span>
            </div>
         </div>
       </div>
       
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 bg-[#1f1f1f] p-6 rounded-3xl shadow-sm border border-neutral-800">
           <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-xl text-white">Order Reports</h3>
              <button className="text-sm text-red-500 font-medium hover:underline">View All</button>
           </div>
           
           <div className="space-y-4">
             {orders.length === 0 ? <p className="text-neutral-500">No orders yet.</p> : (
               orders.slice(-5).reverse().map(o => (
                 <div key={o.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-2xl bg-[#2d2d2d]/50 hover:bg-[#2d2d2d] transition border border-transparent hover:border-neutral-700">
                   <div className="flex items-center gap-4 mb-2 sm:mb-0">
                     <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center text-red-500 font-bold">
                       {o.tableId.includes('takeaway') ? 'TA' : o.tableId.replace('t-', '')}
                     </div>
                     <div>
                       <div className="font-bold text-white">Order #{o.id.slice(-4)}</div>
                       <div className="text-xs text-neutral-500">{new Date(o.createdAt).toLocaleTimeString()} • {o.items.length} Items</div>
                     </div>
                   </div>
                   <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                     <div className="font-bold text-white">{o.total.toFixed(2)} MAD</div>
                     <span className={`text-xs px-3 py-1 rounded-full font-bold uppercase ${
                       o.status === 'READY' ? 'bg-green-500/20 text-green-400' : 
                       o.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-400' :
                       'bg-neutral-700 text-neutral-400'
                     }`}>{o.status}</span>
                   </div>
                 </div>
               ))
             )}
           </div>
         </div>

         <div className="bg-[#1f1f1f] p-6 rounded-3xl shadow-sm border border-neutral-800">
            <h3 className="font-bold text-xl text-white mb-6">Popular Dishes</h3>
            <div className="space-y-4">
                {menu.slice(0, 4).map((item, idx) => (
                  <div key={item.id} className="flex gap-4 items-center">
                     <img src={item.image} className="w-16 h-16 rounded-2xl object-cover bg-neutral-800" />
                     <div className="flex-1">
                        <h4 className="font-bold text-white">{item.name}</h4>
                        <div className="flex items-center gap-1 text-xs text-neutral-500">
                           <span className="text-yellow-500">★ 4.{9-idx}</span>
                           <span>• {120 - idx * 15} sold</span>
                        </div>
                     </div>
                     <div className="font-bold text-red-500">{item.price} MAD</div>
                  </div>
                ))}
            </div>
            <Link to="/admin/menu" className="w-full mt-6 py-3 rounded-xl bg-[#2d2d2d] text-white font-medium hover:bg-[#3d3d3d] transition flex justify-center">
              Manage Menu
            </Link>
         </div>
       </div>
    </>
  );
};

// Table Manager Component
const TableManager = () => {
  const { tables } = useAppContext();
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-white">Table Management</h2>
        <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl font-medium transition">
           + Add Table
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {tables.map(table => (
          <div key={table.id} className="bg-[#1f1f1f] p-6 rounded-3xl shadow-sm border border-neutral-800 flex flex-col items-center text-center group hover:border-red-500/50 transition duration-300">
            <div className="text-4xl font-bold text-white mb-2">{table.number}</div>
            <div className={`text-xs px-3 py-1 rounded-full mb-6 font-medium ${table.status === 'AVAILABLE' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
              {table.status}
            </div>
            <div className="bg-white p-2 rounded-xl mb-4">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`${window.location.origin}/#/client/table/${table.id}`)}`} 
                  alt="QR Code" 
                  className="w-32 h-32"
                />
            </div>
            <a 
              href={`/#/client/table/${table.id}`} 
              target="_blank"
              className="text-sm text-red-400 hover:text-red-300 font-medium hover:underline break-all"
            >
              Open Client View
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

// Booking System Component
const BookingSystem = () => {
  const { bookings, tables, addBooking } = useAppContext();
  const [newBooking, setNewBooking] = useState({ name: '', date: '', time: '', tableId: '' });

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    addBooking({
      id: Date.now().toString(),
      customerName: newBooking.name,
      date: newBooking.date,
      time: newBooking.time,
      tableId: newBooking.tableId,
      depositAmount: 100 // Mock deposit
    });
    setNewBooking({ name: '', date: '', time: '', tableId: '' });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white mb-8">Reservations</h2>
      
      <div className="bg-[#1f1f1f] p-6 rounded-3xl shadow-sm border border-neutral-800">
        <h3 className="font-bold mb-6 text-xl text-red-500">New Reservation</h3>
        <form onSubmit={handleBook} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <input 
            placeholder="Customer Name" 
            required
            className="bg-[#2d2d2d] border-none text-white p-3 rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
            value={newBooking.name}
            onChange={e => setNewBooking({...newBooking, name: e.target.value})}
          />
          <input 
            type="date" 
            required
            className="bg-[#2d2d2d] border-none text-white p-3 rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
            value={newBooking.date}
            onChange={e => setNewBooking({...newBooking, date: e.target.value})}
          />
          <input 
            type="time" 
            required
            className="bg-[#2d2d2d] border-none text-white p-3 rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
            value={newBooking.time}
            onChange={e => setNewBooking({...newBooking, time: e.target.value})}
          />
          <select 
            className="bg-[#2d2d2d] border-none text-white p-3 rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
            required
            value={newBooking.tableId}
            onChange={e => setNewBooking({...newBooking, tableId: e.target.value})}
          >
            <option value="">Select Table</option>
            {tables.map(t => <option key={t.id} value={t.id}>Table {t.number} ({t.capacity} pax)</option>)}
          </select>
          <button className="bg-red-500 text-white p-3 rounded-xl font-bold hover:bg-red-600 transition shadow-lg shadow-red-500/20">Add Booking</button>
        </form>
      </div>

      <div className="bg-[#1f1f1f] rounded-3xl shadow-sm overflow-hidden border border-neutral-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#2d2d2d] text-neutral-400">
              <tr>
                <th className="p-5 font-medium">Customer</th>
                <th className="p-5 font-medium">Date/Time</th>
                <th className="p-5 font-medium">Table</th>
                <th className="p-5 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="text-neutral-200">
              {bookings.length === 0 && <tr><td colSpan={4} className="p-8 text-center text-neutral-500">No active bookings found.</td></tr>}
              {bookings.map(b => (
                <tr key={b.id} className="border-b border-neutral-800 last:border-0 hover:bg-[#2d2d2d]/50 transition">
                  <td className="p-5 font-medium">{b.customerName}</td>
                  <td className="p-5">{b.date} <span className="text-neutral-500 mx-2">|</span> {b.time}</td>
                  <td className="p-5"><span className="bg-neutral-800 px-3 py-1 rounded-lg text-sm">Table {tables.find(t => t.id === b.tableId)?.number}</span></td>
                  <td className="p-5 text-green-400 font-medium">{b.depositAmount} MAD Deposit Paid</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Chat Manager Component
const ChatManager = () => {
    const { chatMessages } = useAppContext();
    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold mb-6 text-white">Live Chats</h2>
            <div className="bg-[#1f1f1f] rounded-3xl shadow-sm border border-neutral-800 overflow-hidden">
            {chatMessages.length === 0 && <p className="p-8 text-neutral-500">No active conversations.</p>}
            <div className="divide-y divide-neutral-800">
                {chatMessages.map(msg => (
                    <div key={msg.id} className="p-6 hover:bg-[#2d2d2d] transition cursor-pointer">
                    <div className="flex justify-between mb-2">
                        <span className="font-bold text-red-500">Table {msg.tableId}</span>
                        <span className="text-xs text-neutral-500">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <p className={`text-sm ${msg.sender === 'client' ? 'text-white' : 'text-neutral-400 italic'}`}>
                        {msg.sender === 'staff' && 'You: '} {msg.text}
                    </p>
                    </div>
                ))}
            </div>
            </div>
        </div>
    )
}

// Route Wrappers to pass Context to Components
const MenuManagerRoute = () => {
  const { menu, addMenuItem, updateMenuItem } = useAppContext();
  return <MenuManager menu={menu} onAdd={addMenuItem} onUpdate={updateMenuItem} />;
}

const KitchenDisplayRoute = () => {
    const { orders, updateOrderStatus } = useAppContext();
    return (
      <ModuleGuard module={SaaSModule.KITCHEN_DISPLAY}>
        <KitchenDisplay orders={orders} updateStatus={updateOrderStatus} />
      </ModuleGuard>
    );
}

// Client Route Wrapper
const ClientRoute = () => {
  const { tableId } = useParams<{tableId: string}>();
  const { menu, addOrder, chatMessages, sendChatMessage, orders } = useAppContext();
  
  if (!tableId) return <Navigate to="/" />;

  const activeOrder = orders.find(o => o.tableId === tableId && o.status !== OrderStatus.SERVED && o.status !== OrderStatus.CANCELLED);

  return (
    <ClientApp 
      tableId={tableId}
      menu={menu}
      activeOrder={activeOrder}
      onPlaceOrder={(items, note) => {
        addOrder({
          tableId,
          items,
          customerNote: note,
          total: items.reduce((acc, i) => acc + (i.price * i.quantity), 0)
        });
      }}
      chatMessages={chatMessages}
      onSendMessage={(text) => {
        sendChatMessage({
          sender: 'client',
          text,
          tableId
        });
      }}
    />
  );
};

// Main App Component
const App = () => {
  // State Initialization
  const [allTenants, setAllTenants] = useState<Tenant[]>([]);
  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null);

  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  // Load Data
  const refreshData = () => {
    setMenu(dbService.getMenu());
    setTables(dbService.getTables());
    setOrders(dbService.getOrders());
    setBookings(dbService.getBookings());
    setChatMessages(dbService.getChatMessages());
    setAllTenants(dbService.getTenants());
  };

  useEffect(() => {
    refreshData();
    // Cross-tab synchronization
    const handleStorageChange = (e: StorageEvent) => {
       // Refresh if any restoflow data changes
       if (e.key && e.key.startsWith('restoflow_')) {
          refreshData();
       }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const switchTenant = (tenantId: string) => {
    const tenant = allTenants.find(t => t.id === tenantId);
    if (tenant) {
      setCurrentTenant(tenant);
      // In a real app, we would reload data here for the specific tenant
    }
  };

  const updateTenantModules = (tenantId: string, modules: SaaSModule[]) => {
     const updatedTenants = allTenants.map(t => 
        t.id === tenantId ? { ...t, activeModules: modules } : t
     );
     setAllTenants(updatedTenants);
     dbService.saveTenants(updatedTenants);
     
     // Update current tenant if selected
     if (currentTenant?.id === tenantId) {
        setCurrentTenant({ ...currentTenant, activeModules: modules });
     }
  };

  // Action Handlers
  const addOrder = (orderData: any) => {
    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      createdAt: Date.now(),
      status: OrderStatus.PENDING,
      ...orderData
    };
    const updatedOrders = [...orders, newOrder];
    setOrders(updatedOrders);
    dbService.saveOrders(updatedOrders);
  };

  const updateOrderStatus = (id: string, status: OrderStatus) => {
    const updatedOrders = orders.map(o => o.id === id ? { ...o, status } : o);
    setOrders(updatedOrders);
    dbService.saveOrders(updatedOrders);
  };

  const addMenuItem = (item: MenuItem) => {
    const updatedMenu = [...menu, item];
    setMenu(updatedMenu);
    dbService.saveMenu(updatedMenu);
  };

  const updateMenuItem = (item: MenuItem) => {
    const updatedMenu = menu.map(i => i.id === item.id ? item : i);
    setMenu(updatedMenu);
    dbService.saveMenu(updatedMenu);
  };

  const addBooking = (booking: Booking) => {
    const updated = [...bookings, booking];
    setBookings(updated);
    dbService.saveBookings(updated);
  };

  const sendChatMessage = (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      ...msg
    };
    const updated = [...chatMessages, newMsg];
    setChatMessages(updated);
    dbService.saveChatMessages(updated);
  };

  const contextValue: AppContextType = {
    currentTenant, allTenants, switchTenant, updateTenantModules,
    menu, tables, orders, bookings, chatMessages,
    addOrder, updateOrderStatus, addMenuItem, updateMenuItem,
    addBooking, sendChatMessage, refreshData
  };

  return (
    <AppContext.Provider value={contextValue}>
      <HashRouter>
        <Routes>
          {/* Landing / Login Placeholder */}
          <Route path="/" element={
            <div className="min-h-screen bg-[#121212] flex items-center justify-center text-white flex-col p-6 relative overflow-hidden">
               {/* Background Elements */}
               <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                  <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-red-600/10 rounded-full blur-[120px]"></div>
                  <div className="absolute top-[40%] right-[10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]"></div>
               </div>

              <div className="max-w-2xl w-full text-center relative z-10">
                <div className="bg-gradient-to-br from-red-500 to-orange-500 w-28 h-28 rounded-3xl mx-auto flex items-center justify-center mb-8 shadow-2xl shadow-red-500/30 transform rotate-3 ring-4 ring-[#1f1f1f]">
                   <Flame size={56} className="text-white fill-white"/>
                </div>
                <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight text-white">RestoFlow</h1>
                <p className="text-xl md:text-2xl text-neutral-400 mb-12 max-w-lg mx-auto leading-relaxed">The Operating System for Modern Restaurants</p>
                
                <div className="grid md:grid-cols-2 gap-4 max-w-lg mx-auto">
                  <Link to="/super-admin" className="bg-white text-black px-6 py-5 rounded-2xl font-bold hover:bg-neutral-200 transition flex items-center justify-center gap-3 transform hover:scale-105 duration-200">
                    <Shield size={22} /> SaaS Owner Login
                  </Link>
                  <Link to="/client/table/t-1" className="bg-[#2d2d2d] text-white px-6 py-5 rounded-2xl font-bold hover:bg-[#3d3d3d] transition flex items-center justify-center gap-3 border border-neutral-700 transform hover:scale-105 duration-200">
                    <QrCode size={22} /> Guest Simulator
                  </Link>
                </div>
                <p className="mt-12 text-neutral-600 text-sm">v1.0.0 (Pre-Release)</p>
              </div>
            </div>
          } />
          
          <Route path="/super-admin" element={<SuperAdminDashboard />} />

          {/* Admin Routes Nested Layout */}
          <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="menu" element={<MenuManagerRoute />} />
              
              <Route path="tables" element={
                <ModuleGuard module={SaaSModule.QR_MENU}>
                  <TableManager />
                </ModuleGuard>
              } />
              
              <Route path="bookings" element={
                 <ModuleGuard module={SaaSModule.TABLE_BOOKING}>
                   <BookingSystem />
                 </ModuleGuard>
              } />
              
              <Route path="chats" element={
                 <ModuleGuard module={SaaSModule.LIVE_CHAT}>
                   <ChatManager />
                 </ModuleGuard>
              } />
          </Route>
          
          {/* Standalone Fullscreen Routes */}
          <Route path="/admin/kitchen" element={<KitchenDisplayRoute />} />
          <Route path="/client/table/:tableId" element={<ClientRoute />} />
          
        </Routes>
      </HashRouter>
    </AppContext.Provider>
  );
};

export default App;