'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from './context/auth-context';
import { useRouter } from 'next/navigation';
import './dashboard.css';

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
      <div className="dashboard-container">
        <div className="dashboard-wrapper">
          <div className="dashboard-header">
            <div className="loading-placeholder" style={{ height: '3rem', marginBottom: '1rem', maxWidth: '75%', margin: '0 auto 1rem' }}></div>
            <div className="loading-placeholder" style={{ height: '1.5rem', maxWidth: '50%', margin: '0 auto' }}></div>
          </div>
          <div className="card">
            <div className="loading-placeholder" style={{ height: '16rem' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-wrapper">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="dashboard-header"
        >
          <div className="header-row">
            <div className="header-content">
              <motion.h1 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="dashboard-title"
              >
                Simple Market Pricers
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="dashboard-subtitle"
              >
                Professional financial instrument pricing tools
              </motion.p>
            </div>
            <div className="user-actions">
              <span className="user-info">Welcome, {user?.username}</span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="logout-btn"
              >
                Logout
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="tabs-container"
        >
          <nav className="tabs-nav">
            {['options', 'bonds', 'swaps'].map((tab) => (
              <motion.button
                key={tab}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(tab)}
                className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {activeTab === tab && (
                  <motion.div
                    layoutId="tabIndicator"
                    className="tab-indicator"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    style={{ width: '100%' }}
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
          className="card main-card"
        >
          <AnimatePresence mode="wait">
            {activeTab === 'options' && (
              <motion.div
                key="options"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="tab-content"
              >
                <div className="card-header" style={{ background: 'linear-gradient(90deg, #3b82f6 0%, #06b6d4 100%)' }}></div>
                <div className="card-content">
                  <h2 className="card-title">Option Pricing (Black-Scholes)</h2>
                  <div className="form-grid">
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="form-column"
                    >
                      <div className="form-group">
                        <label className="form-label">Option Type</label>
                        <motion.select
                          whileFocus={{ scale: 1.02 }}
                          name="type"
                          value={optionParams.type}
                          onChange={handleOptionChange}
                          className="form-select"
                        >
                          <option className="bg-gray-700" value="call">Call Option</option>
                          <option className="bg-gray-700" value="put">Put Option</option>
                        </motion.select>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Spot Price (S)</label>
                        <motion.input
                          whileFocus={{ scale: 1.02 }}
                          type="number"
                          name="S"
                          value={optionParams.S}
                          onChange={handleOptionChange}
                          className="form-input"
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Strike Price (K)</label>
                        <motion.input
                          whileFocus={{ scale: 1.02 }}
                          type="number"
                          name="K"
                          value={optionParams.K}
                          onChange={handleOptionChange}
                          className="form-input"
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Time to Expiry (T)</label>
                        <motion.input
                          whileFocus={{ scale: 1.02 }}
                          type="number"
                          step="0.01"
                          name="T"
                          value={optionParams.T}
                          onChange={handleOptionChange}
                          className="form-input"
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Risk-Free Rate (r)</label>
                        <motion.input
                          whileFocus={{ scale: 1.02 }}
                          type="number"
                          step="0.01"
                          name="r"
                          value={optionParams.r}
                          onChange={handleOptionChange}
                          className="form-input"
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Volatility (σ)</label>
                        <motion.input
                          whileFocus={{ scale: 1.02 }}
                          type="number"
                          step="0.01"
                          name="sigma"
                          value={optionParams.sigma}
                          onChange={handleOptionChange}
                          className="form-input"
                        />
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={priceOption}
                        disabled={loading}
                        className="submit-btn"
                      >
                        {loading ? (
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div className="spinner"></div>
                            Calculating...
                          </div>
                        ) : 'Price Option'}
                      </motion.button>
                    </motion.div>
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                      className="results-column"
                    >
                      {optionResult ? (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="results-container"
                        >
                          <h3 className="results-title">Results</h3>
                          <div className="results-grid">
                            <motion.div 
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.1 }}
                              className="result-item"
                            >
                              <span className="result-label">Price:</span>
                              <span className="result-value call">${optionResult.price.toFixed(2)}</span>
                            </motion.div>
                            <motion.div 
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.2 }}
                              className="result-item"
                            >
                              <span className="result-label">Delta:</span>
                              <span className="result-value">{optionResult.delta.toFixed(3)}</span>
                            </motion.div>
                            <motion.div 
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.3 }}
                              className="result-item"
                            >
                              <span className="result-label">Gamma:</span>
                              <span className="result-value">{optionResult.gamma.toFixed(3)}</span>
                            </motion.div>
                            <motion.div 
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.4 }}
                              className="result-item"
                            >
                              <span className="result-label">Theta:</span>
                              <span className="result-value">{optionResult.theta.toFixed(3)}</span>
                            </motion.div>
                            <motion.div 
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.5 }}
                              className="result-item"
                            >
                              <span className="result-label">Vega:</span>
                              <span className="result-value">{optionResult.vega.toFixed(3)}</span>
                            </motion.div>
                          </div>
                        </motion.div>
                      ) : (
                        <div className="results-container">
                          <div className="results-placeholder">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                            <p className="results-placeholder-text">
                              Enter parameters and click "Price Option" to see results
                            </p>
                          </div>
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
                className="tab-content"
              >
                <div className="card-header" style={{ background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)' }}></div>
                <div className="card-content">
                  <h2 className="card-title">Bond Pricing</h2>
                  <div className="form-grid">
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="form-column"
                    >
                      <div className="form-group">
                        <label className="form-label">Face Value</label>
                        <motion.input
                          whileFocus={{ scale: 1.02 }}
                          type="number"
                          name="faceValue"
                          value={bondParams.faceValue}
                          onChange={handleBondChange}
                          className="form-input"
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Coupon Rate</label>
                        <motion.input
                          whileFocus={{ scale: 1.02 }}
                          type="number"
                          step="0.01"
                          name="couponRate"
                          value={bondParams.couponRate}
                          onChange={handleBondChange}
                          className="form-input"
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Years to Maturity</label>
                        <motion.input
                          whileFocus={{ scale: 1.02 }}
                          type="number"
                          step="0.1"
                          name="yearsToMaturity"
                          value={bondParams.yearsToMaturity}
                          onChange={handleBondChange}
                          className="form-input"
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Yield Rate</label>
                        <motion.input
                          whileFocus={{ scale: 1.02 }}
                          type="number"
                          step="0.01"
                          name="yieldRate"
                          value={bondParams.yieldRate}
                          onChange={handleBondChange}
                          className="form-input"
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Payments per Year</label>
                        <motion.input
                          whileFocus={{ scale: 1.02 }}
                          type="number"
                          name="paymentsPerYear"
                          value={bondParams.paymentsPerYear}
                          onChange={handleBondChange}
                          className="form-input"
                        />
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={priceBond}
                        disabled={loading}
                        className="submit-btn"
                        style={{ background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)' }}
                      >
                        {loading ? (
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div className="spinner"></div>
                            Calculating...
                          </div>
                        ) : 'Price Bond'}
                      </motion.button>
                    </motion.div>
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                      className="results-column"
                    >
                      {bondResult ? (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="results-container"
                        >
                          <h3 className="results-title">Results</h3>
                          <div className="results-grid">
                            <motion.div 
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.1 }}
                              className="result-item"
                            >
                              <span className="result-label">Price:</span>
                              <span className="result-value bond">${bondResult.price.toFixed(2)}</span>
                            </motion.div>
                            <motion.div 
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.2 }}
                              className="result-item"
                            >
                              <span className="result-label">Duration:</span>
                              <span className="result-value">{bondResult.duration.toFixed(2)} years</span>
                            </motion.div>
                          </div>
                        </motion.div>
                      ) : (
                        <div className="results-container">
                          <div className="results-placeholder">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="results-placeholder-text">
                              Enter parameters and click "Price Bond" to see results
                            </p>
                          </div>
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
                className="tab-content"
              >
                <div className="card-header" style={{ background: 'linear-gradient(90deg, #d946ef 0%, #c026d3 100%)' }}></div>
                <div className="card-content">
                  <h2 className="card-title">Interest Rate Swap Pricing</h2>
                  <div className="form-grid">
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="form-column"
                    >
                      <div className="form-group">
                        <label className="form-label">Notional Amount</label>
                        <motion.input
                          whileFocus={{ scale: 1.02 }}
                          type="number"
                          name="notional"
                          value={swapParams.notional}
                          onChange={handleSwapChange}
                          className="form-input"
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Fixed Rate</label>
                        <motion.input
                          whileFocus={{ scale: 1.02 }}
                          type="number"
                          step="0.01"
                          name="fixedRate"
                          value={swapParams.fixedRate}
                          onChange={handleSwapChange}
                          className="form-input"
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Floating Rate</label>
                        <motion.input
                          whileFocus={{ scale: 1.02 }}
                          type="number"
                          step="0.01"
                          name="floatingRate"
                          value={swapParams.floatingRate}
                          onChange={handleSwapChange}
                          className="form-input"
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Years to Maturity</label>
                        <motion.input
                          whileFocus={{ scale: 1.02 }}
                          type="number"
                          step="0.1"
                          name="yearsToMaturity"
                          value={swapParams.yearsToMaturity}
                          onChange={handleSwapChange}
                          className="form-input"
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Payments per Year</label>
                        <motion.input
                          whileFocus={{ scale: 1.02 }}
                          type="number"
                          name="paymentsPerYear"
                          value={swapParams.paymentsPerYear}
                          onChange={handleSwapChange}
                          className="form-input"
                        />
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={priceSwap}
                        disabled={loading}
                        className="submit-btn"
                        style={{ background: 'linear-gradient(90deg, #d946ef 0%, #c026d3 100%)' }}
                      >
                        {loading ? (
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div className="spinner"></div>
                            Calculating...
                          </div>
                        ) : 'Price Swap'}
                      </motion.button>
                    </motion.div>
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                      className="results-column"
                    >
                      {swapResult ? (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="results-container"
                        >
                          <h3 className="results-title">Results</h3>
                          <div className="results-grid">
                            <motion.div 
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.1 }}
                              className="result-item"
                            >
                              <span className="result-label">Present Value:</span>
                              <span className="result-value swap">
                                ${swapResult.presentValue.toLocaleString(undefined, {maximumFractionDigits: 2})}
                              </span>
                            </motion.div>
                            <motion.div 
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.2 }}
                              className="result-item"
                            >
                              <span className="result-label">Par Swap Rate:</span>
                              <span className="result-value">{(swapResult.parSwapRate * 100).toFixed(4)}%</span>
                            </motion.div>
                          </div>
                        </motion.div>
                      ) : (
                        <div className="results-container">
                          <div className="results-placeholder">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                            </svg>
                            <p className="results-placeholder-text">
                              Enter parameters and click "Price Swap" to see results
                            </p>
                          </div>
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
          className="card info-card"
        >
          <div className="info-card-header"></div>
          <div className="info-content">
            <h2 className="info-title">About Simple Market Pricers</h2>
            <p className="info-description">
              This application provides pricing for three key financial instruments:
            </p>
            <ul className="info-list">
              <li className="info-list-item"><span className="info-highlight call">European Options</span> - Using the Black-Scholes model with Greeks calculation</li>
              <li className="info-list-item"><span className="info-highlight bond">Fixed-Coupon Bonds</span> - With yield-to-maturity and duration calculation</li>
              <li className="info-list-item"><span className="info-highlight swap">Plain-Vanilla Interest Rate Swaps</span> - Fixed-for-floating swaps</li>
            </ul>
            <p className="info-description">
              The backend is powered by a Python library implementing industry-standard pricing models.
              All calculations are performed in real-time as you adjust the parameters.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}