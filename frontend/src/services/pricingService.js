import api from './api';

export const pricingService = {
  priceOption: async (params) => {
    const response = await api.post('/pricing/option', params);
    return response.data;
  },

  priceBond: async (params) => {
    const response = await api.post('/pricing/bond', params);
    return response.data;
  },

  priceSwap: async (params) => {
    const response = await api.post('/pricing/swap', params);
    return response.data;
  },

  getHistory: async () => {
    const response = await api.get('/pricing/history');
    return response.data;
  },
};
