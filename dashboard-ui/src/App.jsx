import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export default function App() {
  const [goldData, setGoldData] = useState([]);
  const [silverData, setSilverData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/sentiment')
      .then(response => response.json())
      .then(data => {
        setGoldData(data.filter(item => item.commodity === 'Gold'));
        setSilverData(data.filter(item => item.commodity === 'Silver'));
        setLoading(false);
      })
      .catch(error => console.error("Error fetching AI data:", error));
  }, []);

  // Tailwind styling for the text badges
  const getSentimentStyle = (label) => {
    if (label === 'POSITIVE') return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.2)]';
    if (label === 'NEGATIVE') return 'bg-rose-500/10 text-rose-400 border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.2)]';
    return 'bg-slate-500/10 text-slate-300 border-slate-500/50 shadow-[0_0_15px_rgba(100,116,139,0.2)]';
  };

  // Helper function to convert raw news data into chart statistics
  const generateChartData = (data) => {
    const counts = { POSITIVE: 0, NEGATIVE: 0, NEUTRAL: 0 };
    data.forEach(item => {
      if (counts[item.sentiment_label] !== undefined) {
        counts[item.sentiment_label]++;
      }
    });
    
    return [
      { name: 'Bullish', value: counts.POSITIVE, color: '#10b981' }, // Tailwind Emerald 500
      { name: 'Neutral', value: counts.NEUTRAL, color: '#64748b' },  // Tailwind Slate 500
      { name: 'Bearish', value: counts.NEGATIVE, color: '#f43f5e' }   // Tailwind Rose 500
    ].filter(item => item.value > 0); // Only show slices that actually have data
  };

  // Custom Dark Mode Tooltip for the charts
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/90 border border-slate-700 p-3 rounded-xl shadow-2xl backdrop-blur-md">
          <p className="text-slate-200 text-sm font-bold">{`${payload[0].name}: ${payload[0].value} Headlines`}</p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white font-sans">
        <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mb-4"></div>
        <h2 className="text-xl tracking-widest text-cyan-400 uppercase">Booting AI Engine...</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(6,182,212,0.15),rgba(255,255,255,0))] text-slate-200 p-4 md:p-10 font-sans selection:bg-cyan-500/30">
      
      <header className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
          Commodity Alpha
        </h1>
        <p className="text-slate-400 text-sm tracking-widest uppercase">Live AI Market Sentiment</p>
      </header>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* GOLD COLUMN */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-amber-500/20 p-8 rounded-3xl shadow-2xl relative overflow-hidden transition-all hover:border-amber-500/40 flex flex-col">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -z-10 transform translate-x-1/2 -translate-y-1/2"></div>
          
          <div className="flex justify-between items-end mb-6 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-3xl font-bold text-slate-100">Gold</h2>
              <div className="text-amber-500 font-mono text-sm mt-1">GC=F</div>
            </div>
            <div className="text-xs font-mono text-slate-500 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              LIVE
            </div>
          </div>

          {/* RECHARTS DONUT VISUALIZATION */}
          <div className="h-48 w-full mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={generateChartData(goldData)}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {generateChartData(goldData).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} cursor={{fill: 'transparent'}} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="space-y-4 flex-grow overflow-y-auto pr-2 custom-scrollbar">
            {goldData.slice(0, 4).map((news, index) => (
              <div key={index} className="group bg-slate-950/50 hover:bg-slate-800/50 p-4 rounded-2xl border border-slate-800 transition-colors flex flex-col gap-2">
                <span className={`px-3 py-1 text-[10px] uppercase tracking-wider font-bold w-fit rounded-full border backdrop-blur-sm ${getSentimentStyle(news.sentiment_label)}`}>
                  {news.sentiment_label} · {news.confidence_score}%
                </span>
                <p className="text-slate-300 text-sm leading-relaxed group-hover:text-white transition-colors">{news.title}</p>
              </div>
            ))}
          </div>
        </div>

        {/* SILVER COLUMN */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-400/20 p-8 rounded-3xl shadow-2xl relative overflow-hidden transition-all hover:border-slate-400/40 flex flex-col">
           <div className="absolute top-0 right-0 w-64 h-64 bg-slate-300/5 rounded-full blur-3xl -z-10 transform translate-x-1/2 -translate-y-1/2"></div>

          <div className="flex justify-between items-end mb-6 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-3xl font-bold text-slate-100">Silver</h2>
              <div className="text-slate-400 font-mono text-sm mt-1">SI=F</div>
            </div>
            <div className="text-xs font-mono text-slate-500 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              LIVE
            </div>
          </div>

          {/* RECHARTS DONUT VISUALIZATION */}
          <div className="h-48 w-full mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={generateChartData(silverData)}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {generateChartData(silverData).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} cursor={{fill: 'transparent'}} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-4 flex-grow overflow-y-auto pr-2 custom-scrollbar">
            {silverData.slice(0, 4).map((news, index) => (
              <div key={index} className="group bg-slate-950/50 hover:bg-slate-800/50 p-4 rounded-2xl border border-slate-800 transition-colors flex flex-col gap-2">
                <span className={`px-3 py-1 text-[10px] uppercase tracking-wider font-bold w-fit rounded-full border backdrop-blur-sm ${getSentimentStyle(news.sentiment_label)}`}>
                  {news.sentiment_label} · {news.confidence_score}%
                </span>
                <p className="text-slate-300 text-sm leading-relaxed group-hover:text-white transition-colors">{news.title}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}