import React from 'react';
import Header from '../components/layout/Header';
import OptionPricer from '../components/pricers/OptionPricer';

const OptionsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <OptionPricer />
      </div>
    </div>
  );
};

export default OptionsPage;