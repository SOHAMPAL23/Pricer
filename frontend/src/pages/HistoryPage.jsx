import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/layout/Header';
import { pricingService } from '../services/pricingService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const data = await pricingService.getHistory();
      setHistory(data);
    } catch (error) {
      toast.error('Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  const filteredHistory = filter === 'all' 
    ? history 
    : history.filter(item => item.instrumentType === filter);

  const getTypeColor = (type) => {
    switch(type) {
      case 'option': return 'blue';
      case 'bond': return 'green';
      case 'swap': return 'purple';
      default: return 'gray';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-2">
            Pricing History
          </h1>
          <p className="text-slate-400">View your past calculations</p>
        </motion.div>

        <div className="mb-6 flex space-x-2">
          {['all', 'option', 'bond', 'swap'].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === type
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-12 text-center">
            <p className="text-slate-400">No pricing history found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredHistory.map((item, index) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700/50 p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 bg-${getTypeColor(item.instrumentType)}-600 rounded-lg text-white text-sm font-medium`}>
                      {item.instrumentType.toUpperCase()}
                    </span>
                    <span className="text-slate-400 text-sm">
                      {new Date(item.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-white font-semibold mb-2">Parameters</h4>
                    <div className="space-y-1">
                      {Object.entries(item.parameters).map(([key, value]) => (
                        <div key={key} className="text-sm">
                          <span className="text-slate-400">{key}:</span>{' '}
                          <span className="text-slate-300">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-white font-semibold mb-2">Results</h4>
                    <div className="space-y-1">
                      {Object.entries(item.result).map(([key, value]) => (
                        <div key={key} className="text-sm">
                          <span className="text-slate-400">{key}:</span>{' '}
                          <span className={`text-${getTypeColor(item.instrumentType)}-400 font-medium`}>
                            {typeof value === 'number' ? value.toLocaleString(undefined, { maximumFractionDigits: 4 }) : value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;