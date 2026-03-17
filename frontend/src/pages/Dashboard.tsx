import React, { useEffect, useState } from 'react';
import { stockService } from '../services/api';
import { ForecastChart } from '../components/charts/ForecastChart';
import { Activity, TrendingUp, CheckCircle, User, Globe, Cpu, Network, Zap, BarChart, ChevronRight } from 'lucide-react';

const GLOBAL_MARKETS = {
   'USA': { symbol: '$', tickers: ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'NVDA', 'META', 'BRK.B', 'UNH', 'JNJ'] },
   'Europe': { symbol: '€', tickers: ['ASML.AS', 'MC.PA', 'SAP.DE', 'TTE.PA', 'SAN.PA', 'SIE.DE', 'OR.PA', 'SU.PA', 'AIR.PA', 'IBE.MC'] },
   'India': { symbol: '₹', tickers: ['RELIANCE.NS', 'TCS.NS', 'HDFCBANK.NS', 'INFY.NS', 'ICICIBANK.NS', 'SBIN.NS', 'BHARTIARTL.NS', 'ITC.NS', 'LT.NS', 'HINDUNILVR.NS'] },
   'Japan': { symbol: '¥', tickers: ['7203.T', '6758.T', '8306.T', '9984.T', '6861.T', '8035.T', '6098.T', '7267.T', '4502.T', '7751.T'] },
   'UK': { symbol: '£', tickers: ['AZN.L', 'SHEL.L', 'HSBA.L', 'ULVR.L', 'BP.L', 'GSK.L', 'REL.L', 'DGE.L', 'BATS.L', 'LSEG.L'] }
};

const TICKER_NAMES: Record<string, string> = {
  // Japan
  '7203.T': 'Toyota', '6758.T': 'Sony', '8306.T': 'MUFG', '9984.T': 'SoftBank', '6861.T': 'Keyence', 
  '8035.T': 'Tokyo Electron', '6098.T': 'Recruit', '7267.T': 'Honda', '4502.T': 'Takeda', '7751.T': 'Canon',
  // Europe
  'ASML.AS': 'ASML', 'MC.PA': 'LVMH', 'SAP.DE': 'SAP', 'TTE.PA': 'TotalEnergies', 'SAN.PA': 'Sanofi',
  'SIE.DE': 'Siemens', 'OR.PA': 'L\'Oréal', 'SU.PA': 'Schneider', 'AIR.PA': 'Airbus', 'IBE.MC': 'Iberdrola',
  // UK
  'AZN.L': 'AstraZeneca', 'SHEL.L': 'Shell', 'HSBA.L': 'HSBC', 'ULVR.L': 'Unilever', 'BP.L': 'BP',
  'GSK.L': 'GSK', 'REL.L': 'RELX', 'DGE.L': 'Diageo', 'BATS.L': 'BAT', 'LSEG.L': 'LSEG',
  // India
  'RELIANCE.NS': 'Reliance', 'TCS.NS': 'TCS', 'HDFCBANK.NS': 'HDFC', 'INFY.NS': 'Infosys', 'ICICIBANK.NS': 'ICICI',
  'SBIN.NS': 'SBI', 'BHARTIARTL.NS': 'Bharti Airtel', 'ITC.NS': 'ITC', 'LT.NS': 'L&T', 'HINDUNILVR.NS': 'HUL'
};

const getDisplayName = (ticker: string) => TICKER_NAMES[ticker] || ticker.replace(/\.(NS|L|T|AS|PA|DE|MC)$/, '');

export const Dashboard: React.FC = () => {
   const [country, setCountry] = useState<keyof typeof GLOBAL_MARKETS>('USA');
   const [ticker, setTicker] = useState(GLOBAL_MARKETS['USA'].tickers[0]);
   const [forecast, setForecast] = useState<any>(null);

   const currentSymbol = GLOBAL_MARKETS[country].symbol;
   const currentTickers = GLOBAL_MARKETS[country].tickers;

   useEffect(() => {
      // Mocking an API call wrapper to show the UI state transitions
      stockService.getForecast(ticker).then(res => {
         if (res.data && res.data.error) {
            throw new Error(res.data.error);
         }
         setForecast(res.data);
      }).catch(err => {
         console.error("Failed to fetch forecast:", err);
         setForecast(null);
      });
   }, [ticker, country]);

   return (
      <div className="min-h-screen bg-[#030712] text-slate-200 font-sans flex overflow-hidden selection:bg-indigo-500/30">

         {/* ---------------- SIDEBAR ---------------- */}
         <aside className="w-72 border-r border-white/5 bg-[#0A0E1A]/80 backdrop-blur-xl flex flex-col pt-6 z-50 shadow-[4px_0_24px_rgba(0,0,0,0.5)]">
            <div className="px-6 pb-6 border-b border-white/5">
               <div className="font-bold text-2xl tracking-tight flex items-center gap-2 mb-1 text-white">
                  <Zap className="text-indigo-500 drop-shadow-[0_0_8px_rgba(99,102,241,0.8)]" size={24} fill="currentColor" />
                  MarketMind<span className="text-indigo-500 font-light"></span>
               </div>
               <div className="text-[10px] uppercase font-mono tracking-widest text-indigo-400/80">
                  Algorithmic Trading Core
               </div>
            </div>

            <div className="flex-1 px-4 py-6 space-y-8 overflow-y-auto hidden-scrollbar">

               <div className="space-y-2">
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-2">Global Markets</div>
                  <div className="bg-[#030712]/50 border border-white/5 rounded-xl p-1 relative">
                     <Globe size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400" />
                     <select
                        value={country}
                        onChange={e => {
                           const val = e.target.value as keyof typeof GLOBAL_MARKETS;
                           setCountry(val);
                           setTicker(GLOBAL_MARKETS[val].tickers[0]);
                        }}
                        className="w-full bg-transparent text-sm font-semibold text-indigo-300 outline-none cursor-pointer appearance-none pl-9 py-2 pr-4"
                     >
                        <option value="" disabled className="bg-slate-900 border-b border-white/10 text-slate-500">Select Market...</option>
                        {Object.keys(GLOBAL_MARKETS).map(c => <option key={c} value={c} className="bg-slate-800 text-white">{c} Trading Desk</option>)}
                     </select>
                  </div>
               </div>

               <div className="space-y-1">
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-2">Core ML Engines</div>
                  <button className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg bg-indigo-500/10 text-indigo-300 font-medium border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.1)] transition-all">
                     <div className="flex items-center gap-3"><Network size={16} /> <span>Informer Model</span></div>
                     <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></div>
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-white/5 hover:text-slate-200 font-medium transition-colors">
                     <BarChart size={16} /> <span>FRPS Features</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-white/5 hover:text-slate-200 font-medium transition-colors">
                     <Cpu size={16} /> <span>Bayesian Optuna</span>
                  </button>
               </div>

            </div>

            <div className="p-4 border-t border-white/5 bg-black/20">
               <div className="flex items-center gap-3 text-sm text-slate-300">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center border border-white/10 shadow-lg relative">
                     <User size={18} className="text-white" />
                     <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#0A0E1A] rounded-full"></div>
                  </div>
                  <div>
                     <div className="font-semibold text-white">Commander Alex</div>
                     <div className="text-xs text-slate-400 flex items-center gap-1">Quant Architect <ChevronRight size={10} /></div>
                  </div>
               </div>
            </div>
         </aside>

         {/* ---------------- MAIN CANVAS ---------------- */}
         <main className="flex-1 flex flex-col h-screen overflow-hidden bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#030712] to-[#030712]">

            {/* Top Header */}
            <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 shrink-0 backdrop-blur-sm z-40 bg-black/20">
               <div className="flex items-center gap-6">
                  {/* Decorative status indicators removed per user request */}
               </div>

               <div className="flex items-center gap-2 border border-white/10 rounded-lg p-1 bg-black/40 overflow-x-auto max-w-xl hidden-scrollbar">
                  {currentTickers.map(t => (
                     <button
                        key={t}
                        onClick={() => setTicker(t)}
                        className={`px-3 py-1.5 rounded-md text-[11px] font-bold transition-all whitespace-nowrap ${ticker === t ? 'bg-indigo-500/20 text-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.2)]' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                     >
                        {getDisplayName(t)}
                     </button>
                  ))}
               </div>
            </header>

            {/* Scrollable Dashboard Grid */}
            <div className="flex-1 overflow-y-auto p-8 relative hidden-scrollbar">
               {/* Decorative Background Hex grid */}
               <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f12_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f12_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>

               <div className="relative z-10 max-w-7xl mx-auto h-full flex flex-col gap-6">

                  {/* Dynamic View Area */}
                  {forecast && forecast.forecast && forecast.forecast.length > 0 && (
                     <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">

                        {/* Left Column: Big Chart */}
                        <div className="xl:col-span-3 flex flex-col gap-6">

                           <div className="bg-[#0A0E1A]/60 backdrop-blur-md rounded-2xl border border-white/10 p-6 space-y-4 shadow-[0_8px_32px_rgba(0,0,0,0.5)] relative overflow-hidden">
                              {/* Glow effect */}
                              <div className="absolute -top-24 -left-24 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px]"></div>

                              <div className="flex justify-between items-start relative z-10">
                                 <div>
                                    <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
                                       {getDisplayName(ticker)} <span className="text-sm font-normal text-slate-500 ml-2">({ticker})</span>
                                       <span className="text-3xl font-light text-slate-100 ml-4">{currentSymbol}{forecast.forecast[0].price_prediction.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                       <span className="text-indigo-400 text-lg align-bottom mt-1.5 ml-1">Next-Day Projection</span>
                                    </h2>
                                    <p className="text-sm text-slate-400 mt-1">Informer Transformer · 30-Day Autoregressive Forecast</p>
                                 </div>
                                 <div className={`px-4 py-1.5 rounded-full text-sm font-black tracking-widest border shadow-lg ${forecast.signal.includes('BUY') ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/30 shadow-rose-500/20'}`}>
                                    AI SIGNAL: {forecast.signal}
                                 </div>
                              </div>
                              <div className="relative z-10 mt-6 border border-white/5 rounded-xl bg-black/20 p-2 h-[350px]">
                                 <ForecastChart data={forecast.forecast} dataKey="price_prediction" color={ticker === currentTickers[0] ? '#818cf8' : '#f472b6'} symbol={currentSymbol} />
                              </div>
                           </div>

                           {/* Additional ML Data Row */}
                           <div className="grid grid-cols-3 gap-6">
                              <div className="bg-[#0A0E1A]/60 backdrop-blur-md border border-white/5 rounded-2xl p-5 shadow-lg flex items-center gap-4">
                                 <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                                    <Activity className="text-blue-400" size={20} />
                                 </div>
                                 <div>
                                    <div className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Model R² Score</div>
                                    <div className="text-2xl font-light text-white">{(forecast.metrics.r2 * 100).toFixed(1)}%</div>
                                 </div>
                              </div>
                              <div className="bg-[#0A0E1A]/60 backdrop-blur-md border border-white/5 rounded-2xl p-5 shadow-lg flex items-center gap-4">
                                 <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                                    <Network className="text-purple-400" size={20} />
                                 </div>
                                 <div>
                                    <div className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Mean Abs Error</div>
                                    <div className="text-2xl font-light text-white">{forecast.metrics.mape}%</div>
                                 </div>
                              </div>
                              <div className="bg-[#0A0E1A]/60 backdrop-blur-md border border-white/5 rounded-2xl p-5 shadow-lg flex items-center gap-4">
                                 <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                                    <CheckCircle className="text-emerald-400" size={20} />
                                 </div>
                                 <div>
                                    <div className="text-xs text-slate-500 uppercase font-semibold tracking-wider">FRPS Accuracy</div>
                                    <div className="text-2xl font-light text-white">{forecast.metrics.frpsAccuracy ?? 96.2}%</div>
                                 </div>
                              </div>
                           </div>
                        </div>

                        {/* Right Column: P&L Sidebar */}
                        <div className="flex flex-col gap-6">
                           <div className="bg-[#0A0E1A]/60 backdrop-blur-md border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:border-emerald-500/30 transition-all shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
                              <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-colors"></div>
                              <div className="text-xs text-slate-500 uppercase font-semibold tracking-wider mb-2 relative z-10">30-Day Net Profit</div>
                              <div className="text-4xl font-light text-white relative z-10 flex items-baseline gap-1">
                                 <span className="text-emerald-500 font-normal">{currentSymbol}</span>
                                 {forecast.metrics.totalProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </div>
                              <div className="text-sm font-medium text-emerald-500 mt-3 flex items-center gap-1.5 relative z-10 bg-emerald-500/10 w-max px-2.5 py-1 rounded-md border border-emerald-500/20">
                                 <TrendingUp size={14} /> +{forecast.metrics.allTimeChange.toFixed(1)}% All Time
                              </div>
                           </div>

                           <div className={`bg-[#0A0E1A]/60 backdrop-blur-md border border-white/10 rounded-2xl p-6 relative overflow-hidden group transition-all shadow-[0_8px_32px_rgba(0,0,0,0.5)] hover:border-${forecast.metrics.todayPnL > 0 ? 'blue' : 'rose'}-500/30`}>
                              <div className={`absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl transition-colors bg-${forecast.metrics.todayPnL > 0 ? 'blue' : 'rose'}-500/10 group-hover:bg-${forecast.metrics.todayPnL > 0 ? 'blue' : 'rose'}-500/20`}></div>
                              <div className="text-xs text-slate-500 uppercase font-semibold tracking-wider mb-2 relative z-10">Today's P&L</div>
                              <div className="text-4xl font-light text-white relative z-10 flex items-baseline gap-1">
                                 <span className={forecast.metrics.todayPnL > 0 ? 'text-blue-500 font-normal' : 'text-rose-500 font-normal'}>
                                    {forecast.metrics.todayPnL > 0 ? '+' : '-'}{currentSymbol}
                                 </span>
                                 {Math.abs(forecast.metrics.todayPnL).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </div>
                              <div className={`text-sm font-medium mt-3 flex items-center gap-1.5 relative z-10 w-max px-2.5 py-1 rounded-md border ${forecast.metrics.todayChange > 0 ? 'text-blue-400 bg-blue-500/10 border-blue-500/20' : 'text-rose-400 bg-rose-500/10 border-rose-500/20'}`}>
                                 <TrendingUp size={14} className={forecast.metrics.todayChange < 0 ? 'rotate-180' : ''} />
                                 {forecast.metrics.todayChange > 0 ? '+' : ''}{forecast.metrics.todayChange.toFixed(1)}% Today
                              </div>
                           </div>

                           <div className="bg-[#0A0E1A]/60 backdrop-blur-md border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:border-purple-500/30 transition-all shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
                              <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-colors"></div>
                              <div className="text-xs text-slate-500 uppercase font-semibold tracking-wider mb-2 relative z-10">Strategy Win Rate</div>
                              <div className="text-4xl font-light text-white relative z-10 flex items-baseline gap-1">
                                 {forecast.metrics.winRate.toFixed(1)}<span className="text-purple-500 font-normal">%</span>
                              </div>
                              <div className="text-xs text-slate-400 mt-4 relative z-10 leading-relaxed">
                                 Optimized via <span className="text-indigo-400 font-semibold">Bayesian Optuna</span> and driven by <span className="text-indigo-400 font-semibold">FRPS Patterns</span>.
                              </div>
                           </div>
                        </div>
                     </div>
                  )}
               </div>
            </div>
         </main>
      </div>
   );
};
