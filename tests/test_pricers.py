"""
Unit tests for Simple Market Pricers library.

Tests cover:
- Black-Scholes option pricing and Greeks
- Bond pricing and YTM calculation
- Interest rate swap pricing
- Edge cases and boundary conditions
"""

import unittest
import math
import numpy as np
from pricers import (
    OptionPricer, BondPricer, SwapPricer, MarketData,
    price_option, price_bond, price_swap
)


class TestOptionPricer(unittest.TestCase):
    """Test Black-Scholes option pricing and Greeks."""
    
    def setUp(self):
        """Set up test parameters."""
        self.S = 100.0  # Stock price
        self.K = 100.0  # Strike price
        self.T = 0.25   # Time to expiration (3 months)
        self.r = 0.05   # Risk-free rate
        self.sigma = 0.20  # Volatility
    
    def test_call_option_pricing(self):
        """Test call option pricing."""
        call_price = OptionPricer.black_scholes_call(self.S, self.K, self.T, self.r, self.sigma)
        self.assertGreater(call_price, 0)
        self.assertLess(call_price, self.S)  # Call price should be less than stock price
        
        # Test at-the-money call
        atm_call = OptionPricer.black_scholes_call(100, 100, 0.25, 0.05, 0.20)
        self.assertAlmostEqual(atm_call, 4.33, places=1)
    
    def test_put_option_pricing(self):
        """Test put option pricing."""
        put_price = OptionPricer.black_scholes_put(self.S, self.K, self.T, self.r, self.sigma)
        self.assertGreater(put_price, 0)
        
        # Test put-call parity
        call_price = OptionPricer.black_scholes_call(self.S, self.K, self.T, self.r, self.sigma)
        put_parity = call_price + self.K * math.exp(-self.r * self.T) - self.S
        self.assertAlmostEqual(put_price, put_parity, places=10)
    
    def test_option_greeks(self):
        """Test option Greeks calculations."""
        # Test delta
        call_delta = OptionPricer.delta_call(self.S, self.K, self.T, self.r, self.sigma)
        put_delta = OptionPricer.delta_put(self.S, self.K, self.T, self.r, self.sigma)
        
        self.assertGreater(call_delta, 0)
        self.assertLess(call_delta, 1)
        self.assertLess(put_delta, 0)
        self.assertGreater(put_delta, -1)
        
        # Test gamma (same for calls and puts)
        gamma = OptionPricer.gamma(self.S, self.K, self.T, self.r, self.sigma)
        self.assertGreater(gamma, 0)
        
        # Test vega
        vega = OptionPricer.vega(self.S, self.K, self.T, self.r, self.sigma)
        self.assertGreater(vega, 0)
    
    def test_zero_time_to_expiration(self):
        """Test options at expiration."""
        call_price = OptionPricer.black_scholes_call(self.S, self.K, 0, self.r, self.sigma)
        put_price = OptionPricer.black_scholes_put(self.S, self.K, 0, self.r, self.sigma)
        
        # At expiration, call = max(S-K, 0), put = max(K-S, 0)
        expected_call = max(self.S - self.K, 0)
        expected_put = max(self.K - self.S, 0)
        
        self.assertEqual(call_price, expected_call)
        self.assertEqual(put_price, expected_put)
    
    def test_high_volatility(self):
        """Test options with high volatility."""
        high_vol = 1.0  # 100% volatility
        call_price = OptionPricer.black_scholes_call(self.S, self.K, self.T, self.r, high_vol)
        put_price = OptionPricer.black_scholes_put(self.S, self.K, self.T, self.r, high_vol)
        
        # High volatility should increase option prices
        normal_call = OptionPricer.black_scholes_call(self.S, self.K, self.T, self.r, self.sigma)
        normal_put = OptionPricer.black_scholes_put(self.S, self.K, self.T, self.r, self.sigma)
        
        self.assertGreater(call_price, normal_call)
        self.assertGreater(put_price, normal_put)


class TestBondPricer(unittest.TestCase):
    """Test bond pricing and YTM calculation."""
    
    def setUp(self):
        """Set up test parameters."""
        self.face_value = 1000.0
        self.coupon_rate = 0.05  # 5% annual
        self.years_to_maturity = 5.0
        self.yield_rate = 0.04  # 4% market yield
        self.payments_per_year = 2  # Semi-annual
    
    def test_bond_pricing(self):
        """Test bond present value calculation."""
        price = BondPricer.present_value(
            self.face_value, self.coupon_rate, self.years_to_maturity, 
            self.yield_rate, self.payments_per_year
        )
        
        self.assertGreater(price, 0)
        # Bond trading at premium (coupon > yield)
        self.assertGreater(price, self.face_value)
    
    def test_bond_at_par(self):
        """Test bond pricing when coupon equals yield."""
        price = BondPricer.present_value(
            self.face_value, self.yield_rate, self.years_to_maturity, 
            self.yield_rate, self.payments_per_year
        )
        
        self.assertAlmostEqual(price, self.face_value, places=2)
    
    def test_bond_discount(self):
        """Test bond pricing when coupon < yield."""
        low_coupon = 0.02  # 2% coupon
        price = BondPricer.present_value(
            self.face_value, low_coupon, self.years_to_maturity, 
            self.yield_rate, self.payments_per_year
        )
        
        self.assertLess(price, self.face_value)  # Trading at discount
    
    def test_ytm_calculation(self):
        """Test yield-to-maturity calculation."""
        # First calculate a bond price
        price = BondPricer.present_value(
            self.face_value, self.coupon_rate, self.years_to_maturity, 
            self.yield_rate, self.payments_per_year
        )
        
        # Then calculate YTM from that price
        ytm = BondPricer.yield_to_maturity(
            self.face_value, self.coupon_rate, self.years_to_maturity, 
            price, self.payments_per_year
        )
        
        # YTM should be close to the original yield rate
        self.assertAlmostEqual(ytm, self.yield_rate, places=4)
    
    def test_bond_duration(self):
        """Test bond duration calculation."""
        duration = BondPricer.duration(
            self.face_value, self.coupon_rate, self.years_to_maturity, 
            self.yield_rate, self.payments_per_year
        )
        
        self.assertGreater(duration, 0)
        self.assertLess(duration, self.years_to_maturity)
        
        # Zero-coupon bond duration should equal maturity
        zero_duration = BondPricer.duration(
            self.face_value, 0, self.years_to_maturity, 
            self.yield_rate, self.payments_per_year
        )
        self.assertAlmostEqual(zero_duration, self.years_to_maturity, places=1)
    
    def test_zero_maturity_bond(self):
        """Test bond with zero time to maturity."""
        price = BondPricer.present_value(self.face_value, self.coupon_rate, 0, self.yield_rate)
        self.assertEqual(price, self.face_value)


class TestSwapPricer(unittest.TestCase):
    """Test interest rate swap pricing."""
    
    def setUp(self):
        """Set up test parameters."""
        self.notional = 1000000.0
        self.fixed_rate = 0.05  # 5% fixed
        self.floating_rate = 0.04  # 4% floating
        self.years_to_maturity = 2.0
        self.payments_per_year = 2
    
    def test_discount_factor(self):
        """Test discount factor calculation."""
        df = SwapPricer.discount_factor(0.05, 1.0)
        expected = math.exp(-0.05)
        self.assertAlmostEqual(df, expected, places=10)
    
    def test_swap_present_value(self):
        """Test swap present value calculation."""
        pv = SwapPricer.swap_present_value(
            self.notional, self.fixed_rate, self.floating_rate,
            self.years_to_maturity, self.payments_per_year
        )
        
        # Fixed payer should be paying (negative PV) when fixed > floating
        self.assertLess(pv, 0)
    
    def test_par_swap_rate(self):
        """Test par swap rate calculation."""
        par_rate = SwapPricer.par_swap_rate(
            self.floating_rate, self.years_to_maturity, self.payments_per_year
        )
        
        # Par rate should be close to floating rate for short maturities
        self.assertAlmostEqual(par_rate, self.floating_rate, places=2)
    
    def test_swap_at_par(self):
        """Test swap when fixed rate equals par rate."""
        par_rate = SwapPricer.par_swap_rate(
            self.floating_rate, self.years_to_maturity, self.payments_per_year
        )
        
        pv = SwapPricer.swap_present_value(
            self.notional, par_rate, self.floating_rate,
            self.years_to_maturity, self.payments_per_year
        )
        
        # PV should be close to zero
        self.assertAlmostEqual(pv, 0, places=2)


class TestConvenienceFunctions(unittest.TestCase):
    """Test convenience functions."""
    
    def test_price_option_function(self):
        """Test price_option convenience function."""
        result = price_option('call', 100, 100, 0.25, 0.05, 0.20)
        
        self.assertIn('price', result)
        self.assertIn('delta', result)
        self.assertIn('gamma', result)
        self.assertIn('theta', result)
        self.assertIn('vega', result)
        
        self.assertGreater(result['price'], 0)
        self.assertGreater(result['delta'], 0)
        self.assertGreater(result['gamma'], 0)
        self.assertGreater(result['vega'], 0)
    
    def test_price_bond_function(self):
        """Test price_bond convenience function."""
        result = price_bond(1000, 0.05, 5, 0.04)
        
        self.assertIn('price', result)
        self.assertIn('duration', result)
        
        self.assertGreater(result['price'], 0)
        self.assertGreater(result['duration'], 0)
    
    def test_price_swap_function(self):
        """Test price_swap convenience function."""
        result = price_swap(1000000, 0.05, 0.04, 2)
        
        self.assertIn('present_value', result)
        self.assertIn('par_swap_rate', result)
        
        self.assertGreater(result['par_swap_rate'], 0)


class TestMarketData(unittest.TestCase):
    """Test market data container."""
    
    def test_market_data_initialization(self):
        """Test market data initialization."""
        market = MarketData(risk_free_rate=0.05, volatility=0.20)
        
        self.assertEqual(market.risk_free_rate, 0.05)
        self.assertEqual(market.volatility, 0.20)
    
    def test_discount_factor(self):
        """Test discount factor from market data."""
        market = MarketData(risk_free_rate=0.05)
        df = market.get_discount_factor(1.0)
        
        expected = math.exp(-0.05)
        self.assertAlmostEqual(df, expected, places=10)


class TestEdgeCases(unittest.TestCase):
    """Test edge cases and boundary conditions."""
    
    def test_negative_rates(self):
        """Test pricing with negative interest rates."""
        # This should not crash, though results may be unusual
        call_price = OptionPricer.black_scholes_call(100, 100, 0.25, -0.01, 0.20)
        self.assertGreater(call_price, 0)
        
        bond_price = BondPricer.present_value(1000, 0.05, 5, -0.01)
        self.assertGreater(bond_price, 0)
    
    def test_very_high_rates(self):
        """Test pricing with very high interest rates."""
        call_price = OptionPricer.black_scholes_call(100, 100, 0.25, 0.50, 0.20)
        self.assertGreater(call_price, 0)
        
        bond_price = BondPricer.present_value(1000, 0.05, 5, 0.50)
        self.assertGreater(bond_price, 0)
    
    def test_zero_volatility(self):
        """Test options with zero volatility."""
        call_price = OptionPricer.black_scholes_call(100, 100, 0.25, 0.05, 0.0)
        # With zero volatility, option should be worth intrinsic value
        intrinsic = max(100 - 100, 0)  # Should be 0 for ATM
        self.assertAlmostEqual(call_price, intrinsic, places=10)


if __name__ == '__main__':
    # Run tests with verbose output
    unittest.main(verbosity=2)
