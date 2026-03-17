import React, { useState } from 'react';
import type { ReactNode } from 'react';
import { User, Globe, Cpu, Network, Zap, Settings, BarChart, MessageSquare } from 'lucide-react';

export const Layout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [country, setCountry] = useState('USA');
  const countries = ['USA', 'UK', 'India', 'Japan', 'Germany', 'Australia'];

  return (
    <div className="min-h-screen bg-[#030712] text-slate-200 font-sans flex overflow-hidden selection:bg-indigo-500/30">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-white/5 bg-[#0A0E1A]/80 backdrop-blur-xl flex flex-col pt-6 z-50">
        <div className="px-6 pb-6 border-b border-white/5">
          <div className="font-bold text-xl tracking-tight flex items-center gap-2 mb-1 text-white">
            <Zap className="text-indigo-500" size={20} fill="currentColor" />
            Nexus<span className="text-indigo-500 font-light">AI</span>
          </div>
          <div className="text-[10px] uppercase font-mono tracking-widest text-indigo-400/80">
            Algorithmic Trading Core
          </div>
        </div>

        <div className="flex-1 px-4 py-6 space-y-6 overflow-y-auto hidden-scrollbar">
          <div className="space-y-1">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-2">Core Engines</div>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-indigo-500/10 text-indigo-300 font-medium border border-indigo-500/20">
              <Network size={16} /> <span>Informer Model</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-indigo-500/10 text-indigo-300 font-medium border border-indigo-500/20">
              <BarChart size={16} /> <span>FRPS Features</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-indigo-500/10 text-indigo-300 font-medium border border-indigo-500/20">
              <Cpu size={16} /> <span>Bayesian Optuna</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-indigo-500/10 text-indigo-300 font-medium border border-indigo-500/20">
              <MessageSquare size={16} /> <span>TradePulse</span>
            </button>
          </div>
        </div>

        <div className="p-4 border-t border-white/5 bg-black/20">
          <div className="flex items-center gap-3 text-sm text-slate-300 mb-4">
             <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center border border-white/10 shadow-lg">
               <User size={16} className="text-white" />
             </div>
             <div>
               <div className="font-semibold text-white">Commander Alex</div>
               <div className="text-xs text-slate-500">Quant Architect</div>
             </div>
          </div>
          
          <div className="flex items-center gap-2 bg-[#0A0E1A] border border-white/10 rounded-lg px-3 py-2 focus-within:border-indigo-500/50 transition-colors w-full">
            <Globe size={14} className="text-indigo-400" />
            <select 
              value={country} 
              onChange={e => setCountry(e.target.value)}
              className="bg-transparent text-sm font-semibold text-indigo-300 outline-none cursor-pointer appearance-none w-full"
            >
              <option value="" disabled className="bg-slate-900 border-b border-white/10 text-slate-500">Select Market...</option>
              {countries.map(c => <option key={c} value={c} className="bg-slate-800 text-white">{c} Trading Desk</option>)}
            </select>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#030712] to-[#030712]">
        {/* Top Header */}
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 shrink-0 backdrop-blur-sm z-40">
           <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-400/10 px-3 py-1.5 rounded-full border border-emerald-400/20 shadow-[0_0_15px_rgba(52,211,153,0.1)]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                OPTIMIZATION ACTIVE
              </div>
              <div className="text-xs font-mono text-slate-500 border-l border-white/10 pl-4">
                Latency: <span className="text-slate-300">12ms</span> | VRAM: <span className="text-slate-300">14.2GB</span>
              </div>
           </div>
           
           <div className="flex items-center gap-4">
              <button className="p-2 text-slate-400 hover:text-white transition-colors"><Settings size={18} /></button>
           </div>
        </header>
        
        {/* Scrollable Dashboard */}
        <div className="flex-1 overflow-y-auto p-8 relative hidden-scrollbar">
           {/* Decorative Background grid */}
           <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
           <div className="relative z-10 max-w-7xl mx-auto h-full">
               {children}
           </div>
        </div>
      </main>
    </div>
  );
};
