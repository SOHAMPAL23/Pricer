import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { pricingService } from '../../services/pricingService';
import toast from 'react-hot-toast';
import ResultCard from '../common/ResultCard';

const OptionPricer = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [params, setParams] = useState({
    type: 'call',
    S: 100,
    K: 100,
    T: 0.25,
    r: 0.05,
    sigma: 0.20
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setParams({
      ...params,
      [name]: name === 'type' ? value : parseFloat(value)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await pricingService.priceOption(params);
      setResult(data);
      toast.success('Option priced successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Pricing failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-500 mb-2">
          Option Pricing
        </h1>
        <p className="text-slate-400">Black-Scholes model with Greeks calculation</p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6"
        >
          <h3 className="text-xl font-bold text-white mb-6">Parameters</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Option Type
              </label>
              <select
                name="type"
                value={params.type}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:ring-2 focus:ring-blue-500 transition-all"
              >
                <option value="call">Call Option</option>
                <option value="put">Put Option</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Spot Price (S)
              </label>
              <input
                type="number"
                name="S"
                step="0.01"
                value={params.S}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:ring-2 focus:ring-blue-500 transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Strike Price (K)
              </label>
              <input
                type="number"
                name="K"
                step="0.01"
                value={params.K}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:ring-2 focus:ring-blue-500 transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Time to Expiry (T) - years
              </label>
              <input
                type="number"
                name="T"
                step="0.01"
                value={params.T}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:ring-2 focus:ring-blue-500 transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Risk-Free Rate (r)
              </label>
              <input
                type="number"
                name="r"
                step="0.001"
                value={params.r}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:ring-2 focus:ring-blue-500 transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Volatility (σ)
              </label>
              <input
                type="number"
                name="sigma"
                step="0.01"
                value={params.sigma}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:ring-2 focus:ring-blue-500 transition-all"
                required
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 transition-all shadow-lg"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Calculating...
                </div>
              ) : (
                'Price Option'
              )}
            </motion.button>
          </form>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          {result ? (
            <ResultCard title="Results" data={result} color="blue" />
          ) : (
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6 h-full flex items-center justify-center">
              <p className="text-slate-500 text-center">
                Enter parameters and click "Price Option" to see results
              </p>
            </div>
          )}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-8 bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6"
      >
        <h3 className="text-lg font-bold text-white mb-3">About Black-Scholes Model</h3>
        <p className="text-slate-400 text-sm leading-relaxed">
          The Black-Scholes model is a mathematical model for pricing European-style options. 
          It calculates the theoretical value of options based on factors including the current stock price, 
          strike price, time to expiration, risk-free rate, and volatility. The Greeks (Delta, Gamma, Vega, 
          Theta, Rho) measure the sensitivity of the option price to changes in these parameters.
        </p>
      </motion.div>
    </div>
  );
};

export default OptionPricer;