import React, { useState } from 'react';
import { useAppContext } from '../App';
import { SaaSModule, Tenant } from '../types';
import { Shield, Building2, User, CheckCircle, XCircle, LogIn, Layout, Layers, Search, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const SuperAdminDashboard: React.FC = () => {
  const { allTenants, updateTenantModules, switchTenant } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleToggleModule = (tenant: Tenant, module: SaaSModule) => {
    const currentModules = tenant.activeModules;
    let newModules;
    if (currentModules.includes(module)) {
      newModules = currentModules.filter(m => m !== module);
    } else {
      newModules = [...currentModules, module];
    }
    updateTenantModules(tenant.id, newModules);
  };

  const handleLoginAsTenant = (tenantId: string) => {
    switchTenant(tenantId);
    navigate('/admin');
  };

  const handleResetData = () => {
      if (confirm("⚠️ RESET WARNING\n\nAre you sure you want to delete all local data? This will reset the demo to its initial state.")) {
          localStorage.clear();
          window.location.reload();
      }
  };

  const filteredTenants = allTenants.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.ownerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const modulesList = [
    { key: SaaSModule.QR_MENU, label: 'QR Menu' },
    { key: SaaSModule.KITCHEN_DISPLAY, label: 'Kitchen Display' },
    { key: SaaSModule.TABLE_BOOKING, label: 'Bookings' },
    { key: SaaSModule.LIVE_CHAT, label: 'Live Chat' },
    { key: SaaSModule.LOYALTY, label: 'Loyalty & Wallet' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-bold flex items-center gap-3">
              <Shield className="text-red-500 fill-red-500" size={36} />
              SaaS Super Admin
            </h1>
            <p className="text-neutral-400 mt-2">Manage memberships, features, and subscriptions.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <button 
                onClick={handleResetData}
                className="bg-neutral-800 hover:bg-neutral-700 text-red-400 px-4 py-3 rounded-2xl font-bold transition flex items-center justify-center gap-2 border border-neutral-700"
            >
                <Trash2 size={18} /> Reset Demo Data
            </button>
            <div className="bg-[#1f1f1f] rounded-2xl px-4 py-3 flex items-center gap-2 border border-neutral-800 flex-1 sm:w-64">
                <Search size={18} className="text-neutral-500" />
                <input 
                placeholder="Search tenants..." 
                className="bg-transparent outline-none text-white w-full"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
           <div className="bg-[#1f1f1f] p-6 rounded-3xl border border-neutral-800">
              <div className="text-neutral-400 font-bold uppercase text-xs tracking-wider mb-2">Total MRR</div>
              <div className="text-3xl font-bold">125,400 MAD</div>
              <div className="text-green-500 text-sm mt-2">+15% vs last month</div>
           </div>
           <div className="bg-[#1f1f1f] p-6 rounded-3xl border border-neutral-800">
              <div className="text-neutral-400 font-bold uppercase text-xs tracking-wider mb-2">Active Restaurants</div>
              <div className="text-3xl font-bold">{allTenants.length}</div>
              <div className="text-neutral-500 text-sm mt-2">All systems operational</div>
           </div>
           <div className="bg-[#1f1f1f] p-6 rounded-3xl border border-neutral-800">
              <div className="text-neutral-400 font-bold uppercase text-xs tracking-wider mb-2">Modules Active</div>
              <div className="text-3xl font-bold">
                 {allTenants.reduce((acc, t) => acc + t.activeModules.length, 0)}
              </div>
              <div className="text-neutral-500 text-sm mt-2">Across all tenants</div>
           </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white mb-6">Tenant Directory</h2>
          
          <div className="grid grid-cols-1 gap-6">
            {filteredTenants.map(tenant => (
              <div key={tenant.id} className="bg-[#1f1f1f] rounded-3xl border border-neutral-800 overflow-hidden shadow-sm hover:shadow-md transition">
                <div className="p-6 border-b border-neutral-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                   <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-[#2d2d2d] flex items-center justify-center text-2xl font-bold text-neutral-500">
                         {tenant.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                         <h3 className="text-xl font-bold text-white">{tenant.name}</h3>
                         <div className="flex items-center gap-4 text-sm text-neutral-400 mt-1">
                            <span className="flex items-center gap-1"><User size={14}/> {tenant.ownerName}</span>
                            <span className="flex items-center gap-1"><Building2 size={14}/> {tenant.subscriptionPlan} Plan</span>
                         </div>
                      </div>
                   </div>
                   
                   <div className="flex gap-3 w-full md:w-auto mt-4 md:mt-0">
                      <button 
                        onClick={() => handleLoginAsTenant(tenant.id)}
                        className="flex-1 md:flex-none bg-white text-black px-4 py-2 rounded-xl font-bold hover:bg-neutral-200 transition flex items-center justify-center gap-2"
                      >
                         <LogIn size={18} /> Login as Admin
                      </button>
                   </div>
                </div>

                <div className="p-6 bg-[#161616]">
                   <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                     <Layers size={14} /> Active Modules
                   </h4>
                   <div className="flex flex-wrap gap-3">
                      {modulesList.map(module => {
                        const isActive = tenant.activeModules.includes(module.key);
                        return (
                          <button
                            key={module.key}
                            onClick={() => handleToggleModule(tenant, module.key)}
                            className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all duration-200 ${
                              isActive 
                              ? 'bg-red-500/10 border-red-500 text-red-400 hover:bg-red-500/20' 
                              : 'bg-[#252525] border-transparent text-neutral-500 hover:bg-[#2d2d2d] hover:text-neutral-300'
                            }`}
                          >
                             {isActive ? <CheckCircle size={16} /> : <XCircle size={16} />}
                             <span className="font-medium text-sm">{module.label}</span>
                          </button>
                        );
                      })}
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};