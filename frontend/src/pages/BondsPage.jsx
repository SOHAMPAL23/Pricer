import React from 'react';
import Header from '../components/layout/Header';
import BondPricer from '../components/pricers/BondPricer';

const BondsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-emerald-900">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BondPricer />
      </div>
    </div>
  );
};

export default BondsPage;