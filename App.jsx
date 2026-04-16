import React, { useState, useEffect } from 'react';

export default function App() {
  const [goldData, setGoldData] = useState([]);
  const [silverData, setSilverData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetches live data from Python backend
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

  const getSentimentColor = (label) => {
    if (label === 'POSITIVE') return 'bg-green-900 text-green-400 border-green-500';
    if (label === 'NEGATIVE') return 'bg-red-900 text-red-400 border-red-500';
    return 'bg-gray-700 text-gray-300 border-gray-500';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        <h2 className="text-2xl animate-pulse text-blue-400">Loading Live AI Sentiment...</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 font-sans">
      <header className="mb-8 border-b border-gray-700 pb-4">
        <h1 className="text-3xl font-bold text-blue-400">Live Commodity Sentiment</h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* GOLD COLUMN */}
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
          <h2 className="text-2xl font-semibold mb-2 text-yellow-500">GOLD (GC=F)</h2>
          <div className="text-sm text-gray-400 mb-6">Powered by FinBERT AI</div>

          <div className="space-y-4">
            {goldData.slice(0, 5).map((news, index) => (
              <div key={index} className="bg-gray-900 p-4 rounded border-l-4 border-gray-600 flex flex-col gap-2">
                <span className={`px-2 py-1 text-xs font-bold w-fit rounded border ${getSentimentColor(news.sentiment_label)}`}>
                  {news.sentiment_label} ({news.confidence_score}%)
                </span>
                <p className="text-sm">{news.title}</p>
              </div>
            ))}
          </div>
        </div>

        {/* SILVER COLUMN */}
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
          <h2 className="text-2xl font-semibold mb-2 text-gray-300">SILVER (SI=F)</h2>
          <div className="text-sm text-gray-400 mb-6">Powered by FinBERT AI</div>

          <div className="space-y-4">
            {silverData.slice(0, 5).map((news, index) => (
              <div key={index} className="bg-gray-900 p-4 rounded border-l-4 border-gray-600 flex flex-col gap-2">
                <span className={`px-2 py-1 text-xs font-bold w-fit rounded border ${getSentimentColor(news.sentiment_label)}`}>
                  {news.sentiment_label} ({news.confidence_score}%)
                </span>
                <p className="text-sm">{news.title}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}