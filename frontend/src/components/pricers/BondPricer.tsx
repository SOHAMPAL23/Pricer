import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { pricingService } from '../../services/pricingService';
import toast from 'react-hot-toast';
import ResultCard from '../common/ResultCard';

const BondPricer = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [params, setParams] = useState({
    faceValue: 1000,
    couponRate: 0.05,
    yearsToMaturity: 5,
    yieldRate: 0.04,
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
      const data = await pricingService.priceBond(params);
      setResult(data);
      toast.success('Bond priced successfully!');
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
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500 mb-2">
          Bond Pricing
        </h1>
        <p className="text-slate-400">Calculate bond prices and duration</p>
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
                Face Value
              </label>
              <input
                type="number"
                name="faceValue"
                step="1"
                value={params.faceValue}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:ring-2 focus:ring-green-500 transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Coupon Rate (annual)
              </label>
              <input
                type="number"
                name="couponRate"
                step="0.001"
                value={params.couponRate}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:ring-2 focus:ring-green-500 transition-all"
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
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:ring-2 focus:ring-green-500 transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Yield Rate (annual)
              </label>
              <input
                type="number"
                name="yieldRate"
                step="0.001"
                value={params.yieldRate}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:ring-2 focus:ring-green-500 transition-all"
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
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:ring-2 focus:ring-green-500 transition-all"
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
              className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium rounded-xl hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 transition-all shadow-lg"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Calculating...
                </div>
              ) : (
                'Price Bond'
              )}
            </motion.button>
          </form>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          {result ? (
            <ResultCard title="Results" data={result} color="green" />
          ) : (
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6 h-full flex items-center justify-center">
              <p className="text-slate-500 text-center">
                Enter parameters and click "Price Bond" to see results
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
        <h3 className="text-lg font-bold text-white mb-3">About Bond Pricing</h3>
        <p className="text-slate-400 text-sm leading-relaxed">
          Bond pricing calculates the present value of a bond's future cash flows (coupon payments and face value) 
          using the yield to maturity as the discount rate. Duration measures the bond's sensitivity to interest 
          rate changes and represents the weighted average time until cash flows are received. Modified duration 
          estimates the percentage price change for a 1% change in yield.
        </p>
      </motion.div>
    </div>
  );
};

export default BondPricer;