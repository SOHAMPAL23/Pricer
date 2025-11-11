import React from 'react';
import { motion } from 'framer-motion';

const ResultCard = ({ title, data, color = 'blue' }) => {
  const colorClasses = {
    blue: 'from-blue-600 to-cyan-600',
    green: 'from-green-600 to-emerald-600',
    purple: 'from-purple-600 to-pink-600',
  };

  const valueColorClasses = {
    blue: 'text-blue-400',
    green: 'text-green-400',
    purple: 'text-purple-400',
  };

  // Format value based on type and key
  const formatValue = (key, value) => {
    if (typeof value === 'number') {
      // Format percentages
      if (key.includes('Rate') || key.includes('rate') || key.includes('sigma') || key.includes('vega')) {
        return (value * 100).toFixed(4) + '%';
      }
      // Format monetary values
      if (key.includes('Price') || key.includes('price') || key.includes('Value') || key.includes('value')) {
        return '$' + value.toLocaleString(undefined, { maximumFractionDigits: 2 });
      }
      // Format durations
      if (key.includes('duration') || key.includes('Duration') || key.includes('time') || key.includes('Time')) {
        return value.toFixed(4) + ' years';
      }
      // Format Greeks and other numerical values
      return value.toFixed(4);
    }
    return value;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 overflow-hidden shadow-xl"
    >
      <div className={`h-2 w-full bg-gradient-to-r ${colorClasses[color]} rounded-t-2xl`} />
      <div className="p-6">
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          {title}
        </h3>
        <div className="space-y-4">
          {Object.entries(data).map(([key, value], index) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex justify-between items-center p-4 bg-slate-700/30 rounded-xl hover:bg-slate-700/50 transition-all duration-200 border border-slate-700/30"
            >
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-blue-500 mr-3"></div>
                <span className="text-slate-300 font-medium capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </span>
              </div>
              <span className={`font-bold text-lg ${valueColorClasses[color]}`}>
                {formatValue(key, value)}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ResultCard;