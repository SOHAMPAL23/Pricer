import React from 'react';
import { motion } from 'framer-motion';

const ResultCard = ({ title, data, color = 'blue' }) => {
  const colorClasses = {
    blue: 'from-blue-600 to-cyan-600',
    green: 'from-green-600 to-emerald-600',
    purple: 'from-purple-600 to-pink-600',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6"
    >
      <div className={`h-1 w-full bg-gradient-to-r ${colorClasses[color]} rounded-full mb-4`} />
      <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
      <div className="space-y-3">
        {Object.entries(data).map(([key, value], index) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex justify-between items-center p-4 bg-slate-700/30 rounded-lg"
          >
            <span className="text-slate-300 capitalize">
              {key.replace(/([A-Z])/g, ' $1').trim()}:
            </span>
            <span className={`font-bold text-${color}-400`}>
              {typeof value === 'number' 
                ? value.toLocaleString(undefined, { maximumFractionDigits: 4 })
                : value}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ResultCard;