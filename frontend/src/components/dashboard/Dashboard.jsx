import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Header from '../components/layout/Header';

const Dashboard = () => {
  const instruments = [
    {
      title: 'Options',
      description: 'Price European options using Black-Scholes model',
      icon: '📈',
      path: '/options',
      gradient: 'from-blue-600 to-cyan-600',
    },
    {
      title: 'Bonds',
      description: 'Calculate bond prices and duration',
      icon: '📊',
      path: '/bonds',
      gradient: 'from-green-600 to-emerald-600',
    },
    {
      title: 'Swaps',
      description: 'Value interest rate swaps',
      icon: '💱',
      path: '/swaps',
      gradient: 'from-purple-600 to-pink-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-4">
            Financial Market Pricers
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Professional-grade pricing tools for options, bonds, and swaps
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {instruments.map((instrument, index) => (
            <motion.div
              key={instrument.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={instrument.path}>
                <motion.div
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-8 cursor-pointer transition-all hover:shadow-2xl"
                >
                  <div className={`w-16 h-16 bg-gradient-to-r ${instrument.gradient} rounded-xl flex items-center justify-center text-4xl mb-4`}>
                    {instrument.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{instrument.title}</h3>
                  <p className="text-slate-400">{instrument.description}</p>
                  <div className="mt-6 flex items-center text-blue-400 font-medium">
                    <span>Start Pricing</span>
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-8"
        >
          <h2 className="text-2xl font-bold text-white mb-4">Features</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Real-time Pricing</h3>
                <p className="text-slate-400 text-sm">Get instant calculations with industry-standard models</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Greeks Calculation</h3>
                <p className="text-slate-400 text-sm">Complete Greeks for options including Delta, Gamma, Vega</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Pricing History</h3>
                <p className="text-slate-400 text-sm">Track all your calculations and analyze trends</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-pink-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Lightning Fast</h3>
                <p className="text-slate-400 text-sm">Optimized algorithms for instant results</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
