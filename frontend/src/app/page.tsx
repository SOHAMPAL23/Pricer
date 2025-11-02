'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from './context/auth-context';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('options');
  const [optionResult, setOptionResult] = useState<any>(null);
  const [bondResult, setBondResult] = useState<any>(null);
  const [swapResult, setSwapResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // Option pricing state
  const [optionParams, setOptionParams] = useState({
    type: 'call',
    S: 100,
    K: 100,
    T: 0.25,
    r: 0.05,
    sigma: 0.20
  });

  // Bond pricing state
  const [bondParams, setBondParams] = useState({
    faceValue: 1000,
    couponRate: 0.05,
    yearsToMaturity: 5,
    yieldRate: 0.04,
    paymentsPerYear: 2
  });

  // Swap pricing state
  const [swapParams, setSwapParams] = useState({
    notional: 1000000,
    fixedRate: 0.05,
    floatingRate: 0.04,
    yearsToMaturity: 2,
    paymentsPerYear: 2
  });

  const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setOptionParams({
      ...optionParams,
      [name]: name === 'type' ? value : parseFloat(value)
    });
  };

  const handleBondChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBondParams({
      ...bondParams,
      [name]: parseFloat(value)
    });
  };

  const handleSwapChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSwapParams({
      ...swapParams,
      [name]: parseFloat(value)
    });
  };

  const priceOption = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/price-option', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(optionParams),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setOptionResult(data.results);
      } else {
        console.error('Error pricing option:', data.error);
      }
    } catch (error) {
      console.error('Error pricing option:', error);
    } finally {
      setLoading(false);
    }
  };

  const priceBond = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/price-bond', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bondParams),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setBondResult(data.results);
      } else {
        console.error('Error pricing bond:', data.error);
      }
    } catch (error) {
      console.error('Error pricing bond:', error);
    } finally {
      setLoading(false);
    }
  };

  const priceSwap = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/price-swap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(swapParams),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSwapResult(data.results);
      } else {
        console.error('Error pricing swap:', data.error);
      }
    } catch (error) {
      console.error('Error pricing swap:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // Only render the interactive parts on the client
  if (!isClient || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 animate-pulse">
            <div className="h-12 bg-gray-800 rounded-lg mb-4 mx-auto w-3/4"></div>
            <div className="h-6 bg-gray-800 rounded-lg mx-auto w-1/2"></div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-2xl p-6">
            <div className="h-64 bg-gray-700 rounded-xl animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              Simple Market Pricers
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-300">Welcome, {user?.username}</span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Logout
              </motion.button>
            </div>
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Price financial instruments with precision - Options, Bonds, and Swaps
          </p>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8 border-b border-gray-700"
        >
          <nav className="-mb-px flex space-x-8 justify-center">
            {['options', 'bonds', 'swaps'].map((tab) => (
              <motion.button
                key={tab}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-lg transition-all duration-300 relative ${
                  activeTab === tab
                    ? 'text-blue-400'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {activeTab === tab && (
                  <motion.div
                    layoutId="tabIndicator"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.button>
            ))}
          </nav>
        </motion.div>

        {/* Content Area */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden"
        >
          <AnimatePresence mode="wait">
            {activeTab === 'options' && (
              <motion.div
                key="options"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="p-1 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-white mb-6">Option Pricing (Black-Scholes)</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="space-y-6"
                    >
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">Option Type</label>
                          <motion.select
                            whileFocus={{ scale: 1.02 }}
                            name="type"
                            value={optionParams.type}
                            onChange={handleOptionChange}
                            className="w-full rounded-xl bg-gray-700/50 border border-gray-600 text-white shadow-lg focus:border-blue-500 focus:ring-blue-500 p-3 border transition-all duration-200 hover:shadow-xl"
                          >
                            <option className="bg-gray-700" value="call">Call Option</option>
                            <option className="bg-gray-700" value="put">Put Option</option>
                          </motion.select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">Spot Price (S)</label>
                          <motion.input
                            whileFocus={{ scale: 1.02 }}
                            type="number"
                            name="S"
                            value={optionParams.S}
                            onChange={handleOptionChange}
                            className="w-full rounded-xl bg-gray-700/50 border border-gray-600 text-white shadow-lg focus:border-blue-500 focus:ring-blue-500 p-3 border transition-all duration-200 hover:shadow-xl"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">Strike Price (K)</label>
                          <motion.input
                            whileFocus={{ scale: 1.02 }}
                            type="number"
                            name="K"
                            value={optionParams.K}
                            onChange={handleOptionChange}
                            className="w-full rounded-xl bg-gray-700/50 border border-gray-600 text-white shadow-lg focus:border-blue-500 focus:ring-blue-500 p-3 border transition-all duration-200 hover:shadow-xl"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">Time to Expiry (T)</label>
                          <motion.input
                            whileFocus={{ scale: 1.02 }}
                            type="number"
                            step="0.01"
                            name="T"
                            value={optionParams.T}
                            onChange={handleOptionChange}
                            className="w-full rounded-xl bg-gray-700/50 border border-gray-600 text-white shadow-lg focus:border-blue-500 focus:ring-blue-500 p-3 border transition-all duration-200 hover:shadow-xl"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">Risk-Free Rate (r)</label>
                          <motion.input
                            whileFocus={{ scale: 1.02 }}
                            type="number"
                            step="0.01"
                            name="r"
                            value={optionParams.r}
                            onChange={handleOptionChange}
                            className="w-full rounded-xl bg-gray-700/50 border border-gray-600 text-white shadow-lg focus:border-blue-500 focus:ring-blue-500 p-3 border transition-all duration-200 hover:shadow-xl"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">Volatility (σ)</label>
                          <motion.input
                            whileFocus={{ scale: 1.02 }}
                            type="number"
                            step="0.01"
                            name="sigma"
                            value={optionParams.sigma}
                            onChange={handleOptionChange}
                            className="w-full rounded-xl bg-gray-700/50 border border-gray-600 text-white shadow-lg focus:border-blue-500 focus:ring-blue-500 p-3 border transition-all duration-200 hover:shadow-xl"
                          />
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={priceOption}
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 px-4 rounded-xl hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 transition-all duration-300 shadow-xl"
                      >
                        {loading ? (
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Calculating...
                          </div>
                        ) : 'Price Option'}
                      </motion.button>
                    </motion.div>
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                    >
                      {optionResult ? (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="bg-gradient-to-br from-gray-700/50 to-gray-800/50 p-6 rounded-xl border border-gray-600"
                        >
                          <h3 className="text-xl font-semibold text-white mb-4">Results</h3>
                          <div className="space-y-4">
                            <motion.div 
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.1 }}
                              className="flex justify-between items-center p-4 bg-gray-700/30 rounded-lg"
                            >
                              <span className="text-gray-300">Price:</span>
                              <span className="font-bold text-lg text-blue-400">${optionResult.price.toFixed(2)}</span>
                            </motion.div>
                            <motion.div 
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.2 }}
                              className="flex justify-between items-center p-4 bg-gray-700/30 rounded-lg"
                            >
                              <span className="text-gray-300">Delta:</span>
                              <span className="font-medium text-blue-300">{optionResult.delta.toFixed(3)}</span>
                            </motion.div>
                            <motion.div 
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.3 }}
                              className="flex justify-between items-center p-4 bg-gray-700/30 rounded-lg"
                            >
                              <span className="text-gray-300">Gamma:</span>
                              <span className="font-medium text-blue-300">{optionResult.gamma.toFixed(3)}</span>
                            </motion.div>
                            <motion.div 
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.4 }}
                              className="flex justify-between items-center p-4 bg-gray-700/30 rounded-lg"
                            >
                              <span className="text-gray-300">Theta:</span>
                              <span className="font-medium text-blue-300">{optionResult.theta.toFixed(3)}</span>
                            </motion.div>
                            <motion.div 
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.5 }}
                              className="flex justify-between items-center p-4 bg-gray-700/30 rounded-lg"
                            >
                              <span className="text-gray-300">Vega:</span>
                              <span className="font-medium text-blue-300">{optionResult.vega.toFixed(3)}</span>
                            </motion.div>
                          </div>
                        </motion.div>
                      ) : (
                        <div className="bg-gradient-to-br from-gray-700/50 to-gray-800/50 p-6 rounded-xl border border-gray-600 h-full flex items-center justify-center">
                          <p className="text-gray-400 text-center">
                            Enter parameters and click "Price Option" to see results
                          </p>
                        </div>
                      )}
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'bonds' && (
              <motion.div
                key="bonds"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="p-1 bg-gradient-to-r from-green-500 to-emerald-500"></div>
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-white mb-6">Bond Pricing</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="space-y-6"
                    >
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">Face Value</label>
                          <motion.input
                            whileFocus={{ scale: 1.02 }}
                            type="number"
                            name="faceValue"
                            value={bondParams.faceValue}
                            onChange={handleBondChange}
                            className="w-full rounded-xl bg-gray-700/50 border border-gray-600 text-white shadow-lg focus:border-green-500 focus:ring-green-500 p-3 border transition-all duration-200 hover:shadow-xl"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">Coupon Rate</label>
                          <motion.input
                            whileFocus={{ scale: 1.02 }}
                            type="number"
                            step="0.01"
                            name="couponRate"
                            value={bondParams.couponRate}
                            onChange={handleBondChange}
                            className="w-full rounded-xl bg-gray-700/50 border border-gray-600 text-white shadow-lg focus:border-green-500 focus:ring-green-500 p-3 border transition-all duration-200 hover:shadow-xl"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">Years to Maturity</label>
                          <motion.input
                            whileFocus={{ scale: 1.02 }}
                            type="number"
                            step="0.1"
                            name="yearsToMaturity"
                            value={bondParams.yearsToMaturity}
                            onChange={handleBondChange}
                            className="w-full rounded-xl bg-gray-700/50 border border-gray-600 text-white shadow-lg focus:border-green-500 focus:ring-green-500 p-3 border transition-all duration-200 hover:shadow-xl"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">Yield Rate</label>
                          <motion.input
                            whileFocus={{ scale: 1.02 }}
                            type="number"
                            step="0.01"
                            name="yieldRate"
                            value={bondParams.yieldRate}
                            onChange={handleBondChange}
                            className="w-full rounded-xl bg-gray-700/50 border border-gray-600 text-white shadow-lg focus:border-green-500 focus:ring-green-500 p-3 border transition-all duration-200 hover:shadow-xl"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">Payments per Year</label>
                          <motion.input
                            whileFocus={{ scale: 1.02 }}
                            type="number"
                            name="paymentsPerYear"
                            value={bondParams.paymentsPerYear}
                            onChange={handleBondChange}
                            className="w-full rounded-xl bg-gray-700/50 border border-gray-600 text-white shadow-lg focus:border-green-500 focus:ring-green-500 p-3 border transition-all duration-200 hover:shadow-xl"
                          />
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={priceBond}
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-green-600 to-emerald-700 text-white py-3 px-4 rounded-xl hover:from-green-700 hover:to-emerald-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 transition-all duration-300 shadow-xl"
                      >
                        {loading ? (
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Calculating...
                          </div>
                        ) : 'Price Bond'}
                      </motion.button>
                    </motion.div>
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                    >
                      {bondResult ? (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="bg-gradient-to-br from-gray-700/50 to-gray-800/50 p-6 rounded-xl border border-gray-600"
                        >
                          <h3 className="text-xl font-semibold text-white mb-4">Results</h3>
                          <div className="space-y-4">
                            <motion.div 
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.1 }}
                              className="flex justify-between items-center p-4 bg-gray-700/30 rounded-lg"
                            >
                              <span className="text-gray-300">Price:</span>
                              <span className="font-bold text-lg text-green-400">${bondResult.price.toFixed(2)}</span>
                            </motion.div>
                            <motion.div 
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.2 }}
                              className="flex justify-between items-center p-4 bg-gray-700/30 rounded-lg"
                            >
                              <span className="text-gray-300">Duration:</span>
                              <span className="font-medium text-green-300">{bondResult.duration.toFixed(2)} years</span>
                            </motion.div>
                          </div>
                        </motion.div>
                      ) : (
                        <div className="bg-gradient-to-br from-gray-700/50 to-gray-800/50 p-6 rounded-xl border border-gray-600 h-full flex items-center justify-center">
                          <p className="text-gray-400 text-center">
                            Enter parameters and click "Price Bond" to see results
                          </p>
                        </div>
                      )}
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'swaps' && (
              <motion.div
                key="swaps"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="p-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-white mb-6">Interest Rate Swap Pricing</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="space-y-6"
                    >
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">Notional Amount</label>
                          <motion.input
                            whileFocus={{ scale: 1.02 }}
                            type="number"
                            name="notional"
                            value={swapParams.notional}
                            onChange={handleSwapChange}
                            className="w-full rounded-xl bg-gray-700/50 border border-gray-600 text-white shadow-lg focus:border-purple-500 focus:ring-purple-500 p-3 border transition-all duration-200 hover:shadow-xl"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">Fixed Rate</label>
                          <motion.input
                            whileFocus={{ scale: 1.02 }}
                            type="number"
                            step="0.01"
                            name="fixedRate"
                            value={swapParams.fixedRate}
                            onChange={handleSwapChange}
                            className="w-full rounded-xl bg-gray-700/50 border border-gray-600 text-white shadow-lg focus:border-purple-500 focus:ring-purple-500 p-3 border transition-all duration-200 hover:shadow-xl"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">Floating Rate</label>
                          <motion.input
                            whileFocus={{ scale: 1.02 }}
                            type="number"
                            step="0.01"
                            name="floatingRate"
                            value={swapParams.floatingRate}
                            onChange={handleSwapChange}
                            className="w-full rounded-xl bg-gray-700/50 border border-gray-600 text-white shadow-lg focus:border-purple-500 focus:ring-purple-500 p-3 border transition-all duration-200 hover:shadow-xl"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">Years to Maturity</label>
                          <motion.input
                            whileFocus={{ scale: 1.02 }}
                            type="number"
                            step="0.1"
                            name="yearsToMaturity"
                            value={swapParams.yearsToMaturity}
                            onChange={handleSwapChange}
                            className="w-full rounded-xl bg-gray-700/50 border border-gray-600 text-white shadow-lg focus:border-purple-500 focus:ring-purple-500 p-3 border transition-all duration-200 hover:shadow-xl"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">Payments per Year</label>
                          <motion.input
                            whileFocus={{ scale: 1.02 }}
                            type="number"
                            name="paymentsPerYear"
                            value={swapParams.paymentsPerYear}
                            onChange={handleSwapChange}
                            className="w-full rounded-xl bg-gray-700/50 border border-gray-600 text-white shadow-lg focus:border-purple-500 focus:ring-purple-500 p-3 border transition-all duration-200 hover:shadow-xl"
                          />
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={priceSwap}
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-700 text-white py-3 px-4 rounded-xl hover:from-purple-700 hover:to-pink-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 transition-all duration-300 shadow-xl"
                      >
                        {loading ? (
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Calculating...
                          </div>
                        ) : 'Price Swap'}
                      </motion.button>
                    </motion.div>
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                    >
                      {swapResult ? (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="bg-gradient-to-br from-gray-700/50 to-gray-800/50 p-6 rounded-xl border border-gray-600"
                        >
                          <h3 className="text-xl font-semibold text-white mb-4">Results</h3>
                          <div className="space-y-4">
                            <motion.div 
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.1 }}
                              className="flex justify-between items-center p-4 bg-gray-700/30 rounded-lg"
                            >
                              <span className="text-gray-300">Present Value:</span>
                              <span className="font-bold text-lg text-purple-400">
                                ${swapResult.presentValue.toLocaleString(undefined, {maximumFractionDigits: 2})}
                              </span>
                            </motion.div>
                            <motion.div 
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.2 }}
                              className="flex justify-between items-center p-4 bg-gray-700/30 rounded-lg"
                            >
                              <span className="text-gray-300">Par Swap Rate:</span>
                              <span className="font-medium text-purple-300">{(swapResult.parSwapRate * 100).toFixed(4)}%</span>
                            </motion.div>
                          </div>
                        </motion.div>
                      ) : (
                        <div className="bg-gradient-to-br from-gray-700/50 to-gray-800/50 p-6 rounded-xl border border-gray-600 h-full flex items-center justify-center">
                          <p className="text-gray-400 text-center">
                            Enter parameters and click "Price Swap" to see results
                          </p>
                        </div>
                      )}
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Information Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden"
        >
          <div className="p-1 bg-gradient-to-r from-gray-600 to-gray-800"></div>
          <div className="p-6">
            <h2 className="text-2xl font-bold text-white mb-4">About Simple Market Pricers</h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 mb-4">
                This application provides pricing for three key financial instruments:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-300 mb-4">
                <li><span className="text-blue-400 font-medium">European Options</span> - Using the Black-Scholes model with Greeks calculation</li>
                <li><span className="text-green-400 font-medium">Fixed-Coupon Bonds</span> - With yield-to-maturity and duration calculation</li>
                <li><span className="text-purple-400 font-medium">Plain-Vanilla Interest Rate Swaps</span> - Fixed-for-floating swaps</li>
              </ul>
              <p className="text-gray-300">
                The backend is powered by a Python library implementing industry-standard pricing models.
                All calculations are performed in real-time as you adjust the parameters.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}