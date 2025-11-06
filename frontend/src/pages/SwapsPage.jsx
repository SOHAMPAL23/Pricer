import React from 'react';
import Header from '../components/layout/Header';
import SwapPricer from '../components/pricers/SwapPricer';

const SwapsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-pink-900">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SwapPricer />
      </div>
    </div>
  );
};

export default SwapsPage;