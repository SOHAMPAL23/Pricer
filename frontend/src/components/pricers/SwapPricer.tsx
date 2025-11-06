import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { pricingService } from '../../services/pricingService';
import toast from 'react-hot-toast';
import ResultCard from '../common/ResultCard';

const SwapPricer = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [params, setParams] = useState({
    notional: 1000000,
    fixedRate: 0.05,
    floatingRate: 0.04,
    yearsToMaturity: 2,
    paymentsPerYear: 2
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setParams({
      ...params,
      [name]: parseFloat(value)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await pricingService.priceSwap(params);
      setResult(data);
      toast.success('Swap priced successfully!');
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
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mb-2">
          Interest Rate Swap Pricing
        </h1>
        <p className="text-slate-400">Value plain-vanilla interest rate swaps</p>
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
                Notional Amount
              </label>
              <input
                type="number"
                name="notional"
                step="1000"
                value={params.notional}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:ring-2 focus:ring-purple-500 transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Fixed Rate (annual)
              </label>
              <input
                type="number"
                name="fixedRate"
                step="0.001"
                value={params.fixedRate}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:ring-2 focus:ring-purple-500 transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Floating Rate (annual)
              </label>
              <input
                type="number"
                name="floatingRate"
                step="0.001"
                value={params.floatingRate}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:ring-2 focus:ring-purple-500 transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Years to Maturity
              </label>
              <input
                type="number"
                name="yearsToMaturity"
                step="0.1"
                value={params.yearsToMaturity}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:ring-2 focus:ring-purple-500 transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Payments per Year
              </label>
              <select
                name="paymentsPerYear"
                value={params.paymentsPerYear}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:ring-2 focus:ring-purple-500 transition-all"
              >
                <option value="1">Annual (1)</option>
                <option value="2">Semi-Annual (2)</option>
                <option value="4">Quarterly (4)</option>
                <option value="12">Monthly (12)</option>
              </select>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-xl hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 transition-all shadow-lg"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Calculating...
                </div>
              ) : (
                'Price Swap'
              )}
            </motion.button>
          </form>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          {result ? (
            <ResultCard title="Results" data={result} color="purple" />
          ) : (
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6 h-full flex items-center justify-center">
              <p className="text-slate-500 text-center">
                Enter parameters and click "Price Swap" to see results
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
        <h3 className="text-lg font-bold text-white mb-3">About Interest Rate Swaps</h3>
        <p className="text-slate-400 text-sm leading-relaxed">
          An interest rate swap is a derivative contract where two parties exchange interest rate cash flows 
          based on a notional principal amount. In a plain-vanilla swap, one party pays a fixed rate while 
          receiving a floating rate, and the other does the opposite. The present value represents the swap's 
          market value, and the par swap rate is the fixed rate that makes the swap's initial value zero.
        </p>
      </motion.div>
    </div>
  );
};

export default SwapPricer;