"""
Simple Market Pricers - Option, Bond & Swap

A lightweight Python library for pricing vanilla financial instruments:
- European options using Black-Scholes model
- Fixed-coupon bonds with YTM calculation
- Plain-vanilla interest rate swaps

Author: Simple Market Pricers
Version: 1.0.0
"""

import math
import numpy as np
from scipy.stats import norm
from scipy.optimize import newton, brentq
from typing import Tuple, Optional, Union
import warnings


class OptionPricer:
    """
    Black-Scholes option pricing with Greeks calculation.
    
    Assumptions:
    - European options only
    - Constant volatility and risk-free rate
    - No dividends
    - Log-normal stock price distribution
    """
    
    @staticmethod
    def black_scholes_call(S: float, K: float, T: float, r: float, sigma: float) -> float:
        """
        Calculate Black-Scholes call option price.
        
        Args:
            S: Current stock price
            K: Strike price
            T: Time to expiration (years)
            r: Risk-free rate (annual)
            sigma: Volatility (annual)
            
        Returns:
            Call option price
        """
        if T <= 0:
            return max(S - K, 0)
        
        d1 = (math.log(S / K) + (r + 0.5 * sigma**2) * T) / (sigma * math.sqrt(T))
        d2 = d1 - sigma * math.sqrt(T)
        
        call_price = S * norm.cdf(d1) - K * math.exp(-r * T) * norm.cdf(d2)
        return call_price
    
    @staticmethod
    def black_scholes_put(S: float, K: float, T: float, r: float, sigma: float) -> float:
        """
        Calculate Black-Scholes put option price.
        
        Args:
            S: Current stock price
            K: Strike price
            T: Time to expiration (years)
            r: Risk-free rate (annual)
            sigma: Volatility (annual)
            
        Returns:
            Put option price
        """
        if T <= 0:
            return max(K - S, 0)
        
        d1 = (math.log(S / K) + (r + 0.5 * sigma**2) * T) / (sigma * math.sqrt(T))
        d2 = d1 - sigma * math.sqrt(T)
        
        put_price = K * math.exp(-r * T) * norm.cdf(-d2) - S * norm.cdf(-d1)
        return put_price
    
    @staticmethod
    def delta_call(S: float, K: float, T: float, r: float, sigma: float) -> float:
        """Calculate call option delta."""
        if T <= 0:
            return 1.0 if S > K else 0.0
        
        d1 = (math.log(S / K) + (r + 0.5 * sigma**2) * T) / (sigma * math.sqrt(T))
        return norm.cdf(d1)
    
    @staticmethod
    def delta_put(S: float, K: float, T: float, r: float, sigma: float) -> float:
        """Calculate put option delta."""
        if T <= 0:
            return -1.0 if S < K else 0.0
        
        d1 = (math.log(S / K) + (r + 0.5 * sigma**2) * T) / (sigma * math.sqrt(T))
        return norm.cdf(d1) - 1
    
    @staticmethod
    def gamma(S: float, K: float, T: float, r: float, sigma: float) -> float:
        """Calculate option gamma (same for calls and puts)."""
        if T <= 0:
            return 0.0
        
        d1 = (math.log(S / K) + (r + 0.5 * sigma**2) * T) / (sigma * math.sqrt(T))
        return norm.pdf(d1) / (S * sigma * math.sqrt(T))
    
    @staticmethod
    def theta_call(S: float, K: float, T: float, r: float, sigma: float) -> float:
        """Calculate call option theta (time decay)."""
        if T <= 0:
            return 0.0
        
        d1 = (math.log(S / K) + (r + 0.5 * sigma**2) * T) / (sigma * math.sqrt(T))
        d2 = d1 - sigma * math.sqrt(T)
        
        theta = (-S * norm.pdf(d1) * sigma / (2 * math.sqrt(T)) 
                - r * K * math.exp(-r * T) * norm.cdf(d2))
        return theta / 365  # Convert to daily theta
    
    @staticmethod
    def theta_put(S: float, K: float, T: float, r: float, sigma: float) -> float:
        """Calculate put option theta (time decay)."""
        if T <= 0:
            return 0.0
        
        d1 = (math.log(S / K) + (r + 0.5 * sigma**2) * T) / (sigma * math.sqrt(T))
        d2 = d1 - sigma * math.sqrt(T)
        
        theta = (-S * norm.pdf(d1) * sigma / (2 * math.sqrt(T)) 
                + r * K * math.exp(-r * T) * norm.cdf(-d2))
        return theta / 365  # Convert to daily theta
    
    @staticmethod
    def vega(S: float, K: float, T: float, r: float, sigma: float) -> float:
        """Calculate option vega (volatility sensitivity)."""
        if T <= 0:
            return 0.0
        
        d1 = (math.log(S / K) + (r + 0.5 * sigma**2) * T) / (sigma * math.sqrt(T))
        return S * norm.pdf(d1) * math.sqrt(T) / 100  # Convert to 1% vol change


class BondPricer:
    """
    Fixed-coupon bond pricing with yield-to-maturity calculation.
    
    Assumptions:
    - Fixed coupon payments
    - Flat yield curve
    - No credit risk
    - Standard day count conventions
    """
    
    @staticmethod
    def present_value(face_value: float, coupon_rate: float, years_to_maturity: float, 
                     yield_rate: float, payments_per_year: int = 2) -> float:
        """
        Calculate bond present value.
        
        Args:
            face_value: Bond face value (par value)
            coupon_rate: Annual coupon rate (as decimal, e.g., 0.05 for 5%)
            years_to_maturity: Time to maturity in years
            yield_rate: Market yield rate (as decimal)
            payments_per_year: Number of coupon payments per year
            
        Returns:
            Bond present value
        """
        if years_to_maturity <= 0:
            return face_value
        
        n_periods = int(years_to_maturity * payments_per_year)
        coupon_payment = face_value * coupon_rate / payments_per_year
        period_yield = yield_rate / payments_per_year
        
        # Present value of coupon payments
        if period_yield == 0:
            pv_coupons = coupon_payment * n_periods
        else:
            pv_coupons = coupon_payment * (1 - (1 + period_yield)**(-n_periods)) / period_yield
        
        # Present value of face value
        pv_face = face_value / (1 + period_yield)**n_periods
        
        return pv_coupons + pv_face
    
    @staticmethod
    def yield_to_maturity(face_value: float, coupon_rate: float, years_to_maturity: float,
                         current_price: float, payments_per_year: int = 2,
                         tolerance: float = 1e-6, max_iterations: int = 100) -> float:
        """
        Calculate yield-to-maturity using Newton-Raphson method with bisection fallback.
        
        Args:
            face_value: Bond face value
            coupon_rate: Annual coupon rate (as decimal)
            years_to_maturity: Time to maturity in years
            current_price: Current market price
            payments_per_year: Number of coupon payments per year
            tolerance: Convergence tolerance
            max_iterations: Maximum iterations
            
        Returns:
            Yield-to-maturity (annual rate as decimal)
        """
        if years_to_maturity <= 0:
            return 0.0
        
        def price_function(y):
            return BondPricer.present_value(face_value, coupon_rate, years_to_maturity, y, payments_per_year)
        
        def price_derivative(y):
            """Approximate derivative using finite differences."""
            h = 1e-6
            return (price_function(y + h) - price_function(y - h)) / (2 * h)
        
        # Initial guess based on coupon rate
        y0 = coupon_rate
        
        try:
            # Try Newton-Raphson method
            ytm = newton(lambda y: price_function(y) - current_price, y0, 
                        fprime=price_derivative, tol=tolerance, maxiter=max_iterations)
            return ytm
        except (RuntimeError, ValueError):
            # Fallback to bisection method
            try:
                # Find bracket for bisection
                y_low, y_high = 0.0, 0.5  # 0% to 50% yield
                
                # Expand bracket if needed
                while price_function(y_high) > current_price and y_high < 2.0:
                    y_high *= 2
                
                ytm = brentq(lambda y: price_function(y) - current_price, 
                           y_low, y_high, xtol=tolerance, maxiter=max_iterations)
                return ytm
            except ValueError:
                warnings.warn("Could not converge to YTM. Returning coupon rate as approximation.")
                return coupon_rate
    
    @staticmethod
    def duration(face_value: float, coupon_rate: float, years_to_maturity: float,
                yield_rate: float, payments_per_year: int = 2) -> float:
        """
        Calculate Macaulay duration.
        
        Args:
            face_value: Bond face value
            coupon_rate: Annual coupon rate (as decimal)
            years_to_maturity: Time to maturity in years
            yield_rate: Market yield rate (as decimal)
            payments_per_year: Number of coupon payments per year
            
        Returns:
            Macaulay duration in years
        """
        if years_to_maturity <= 0:
            return 0.0
        
        n_periods = int(years_to_maturity * payments_per_year)
        coupon_payment = face_value * coupon_rate / payments_per_year
        period_yield = yield_rate / payments_per_year
        
        weighted_sum = 0.0
        bond_price = BondPricer.present_value(face_value, coupon_rate, years_to_maturity, 
                                            yield_rate, payments_per_year)
        
        for t in range(1, n_periods + 1):
            if t == n_periods:
                # Final payment includes face value
                payment = coupon_payment + face_value
            else:
                payment = coupon_payment
            
            pv_payment = payment / (1 + period_yield)**t
            weighted_sum += t * pv_payment
        
        return weighted_sum / (bond_price * payments_per_year)


class SwapPricer:
    """
    Plain-vanilla interest rate swap pricing.
    
    Assumptions:
    - Fixed-for-floating swap
    - Flat yield curve
    - No credit risk
    - Standard day count conventions
    """
    
    @staticmethod
    def discount_factor(rate: float, time: float) -> float:
        """
        Calculate discount factor for given rate and time.
        
        Args:
            rate: Interest rate (annual, as decimal)
            time: Time in years
            
        Returns:
            Discount factor
        """
        return math.exp(-rate * time)
    
    @staticmethod
    def swap_present_value(notional: float, fixed_rate: float, floating_rate: float,
                          years_to_maturity: float, payments_per_year: int = 2) -> float:
        """
        Calculate swap present value from fixed-rate payer perspective.
        
        Args:
            notional: Notional amount
            fixed_rate: Fixed rate (annual, as decimal)
            floating_rate: Current floating rate (annual, as decimal)
            years_to_maturity: Time to maturity in years
            payments_per_year: Number of payments per year
            
        Returns:
            Swap PV (positive = fixed payer receives, negative = fixed payer pays)
        """
        if years_to_maturity <= 0:
            return 0.0
        
        n_periods = int(years_to_maturity * payments_per_year)
        period_rate = floating_rate / payments_per_year
        
        # Present value of fixed leg
        fixed_payment = notional * fixed_rate / payments_per_year
        pv_fixed = 0.0
        
        for t in range(1, n_periods + 1):
            time_to_payment = t / payments_per_year
            df = SwapPricer.discount_factor(floating_rate, time_to_payment)
            pv_fixed += fixed_payment * df
        
        # Present value of floating leg (par value at current rates)
        pv_floating = notional * (1 - SwapPricer.discount_factor(floating_rate, years_to_maturity))
        
        # Swap PV from fixed payer perspective
        return pv_floating - pv_fixed
    
    @staticmethod
    def par_swap_rate(floating_rate: float, years_to_maturity: float, 
                     payments_per_year: int = 2) -> float:
        """
        Calculate par swap rate (rate that makes swap PV = 0).
        
        Args:
            floating_rate: Current floating rate (annual, as decimal)
            years_to_maturity: Time to maturity in years
            payments_per_year: Number of payments per year
            
        Returns:
            Par swap rate (annual, as decimal)
        """
        if years_to_maturity <= 0:
            return floating_rate
        
        n_periods = int(years_to_maturity * payments_per_year)
        
        # Calculate annuity factor
        annuity_factor = 0.0
        for t in range(1, n_periods + 1):
            time_to_payment = t / payments_per_year
            df = SwapPricer.discount_factor(floating_rate, time_to_payment)
            annuity_factor += df
        
        # Calculate PV01 (present value of 1 basis point)
        pv01 = annuity_factor / payments_per_year
        
        # Par swap rate
        if pv01 > 0:
            return floating_rate * (1 - SwapPricer.discount_factor(floating_rate, years_to_maturity)) / pv01
        else:
            return floating_rate


class MarketData:
    """
    Simple market data container for pricing examples.
    """
    
    def __init__(self, risk_free_rate: float = 0.05, volatility: float = 0.20):
        """
        Initialize market data.
        
        Args:
            risk_free_rate: Risk-free rate (annual, as decimal)
            volatility: Market volatility (annual, as decimal)
        """
        self.risk_free_rate = risk_free_rate
        self.volatility = volatility
    
    def get_discount_factor(self, time: float) -> float:
        """Get discount factor for given time."""
        return SwapPricer.discount_factor(self.risk_free_rate, time)


def price_option(option_type: str, S: float, K: float, T: float, r: float, sigma: float) -> dict:
    """
    Convenience function to price options and calculate Greeks.
    
    Args:
        option_type: 'call' or 'put'
        S: Current stock price
        K: Strike price
        T: Time to expiration (years)
        r: Risk-free rate (annual)
        sigma: Volatility (annual)
        
    Returns:
        Dictionary with price and Greeks
    """
    if option_type.lower() == 'call':
        price = OptionPricer.black_scholes_call(S, K, T, r, sigma)
        delta = OptionPricer.delta_call(S, K, T, r, sigma)
        theta = OptionPricer.theta_call(S, K, T, r, sigma)
    elif option_type.lower() == 'put':
        price = OptionPricer.black_scholes_put(S, K, T, r, sigma)
        delta = OptionPricer.delta_put(S, K, T, r, sigma)
        theta = OptionPricer.theta_put(S, K, T, r, sigma)
    else:
        raise ValueError("Option type must be 'call' or 'put'")
    
    gamma = OptionPricer.gamma(S, K, T, r, sigma)
    vega = OptionPricer.vega(S, K, T, r, sigma)
    
    return {
        'price': price,
        'delta': delta,
        'gamma': gamma,
        'theta': theta,
        'vega': vega
    }


def price_bond(face_value: float, coupon_rate: float, years_to_maturity: float,
              yield_rate: float, payments_per_year: int = 2) -> dict:
    """
    Convenience function to price bonds and calculate duration.
    
    Args:
        face_value: Bond face value
        coupon_rate: Annual coupon rate (as decimal)
        years_to_maturity: Time to maturity in years
        yield_rate: Market yield rate (as decimal)
        payments_per_year: Number of coupon payments per year
        
    Returns:
        Dictionary with price and duration
    """
    price = BondPricer.present_value(face_value, coupon_rate, years_to_maturity, 
                                   yield_rate, payments_per_year)
    duration = BondPricer.duration(face_value, coupon_rate, years_to_maturity, 
                                 yield_rate, payments_per_year)
    
    return {
        'price': price,
        'duration': duration
    }


def price_swap(notional: float, fixed_rate: float, floating_rate: float,
              years_to_maturity: float, payments_per_year: int = 2) -> dict:
    """
    Convenience function to price swaps.
    
    Args:
        notional: Notional amount
        fixed_rate: Fixed rate (annual, as decimal)
        floating_rate: Current floating rate (annual, as decimal)
        years_to_maturity: Time to maturity in years
        payments_per_year: Number of payments per year
        
    Returns:
        Dictionary with PV and par rate
    """
    pv = SwapPricer.swap_present_value(notional, fixed_rate, floating_rate,
                                     years_to_maturity, payments_per_year)
    par_rate = SwapPricer.par_swap_rate(floating_rate, years_to_maturity, payments_per_year)
    
    return {
        'present_value': pv,
        'par_swap_rate': par_rate
    }


if __name__ == "__main__":
    # Example usage
    print("Simple Market Pricers - Example Usage")
    print("=" * 50)
    
    # Option pricing example
    print("\n1. Option Pricing (Black-Scholes):")
    option_result = price_option('call', S=100, K=100, T=0.25, r=0.05, sigma=0.20)
    print(f"Call Option: ${option_result['price']:.2f}")
    print(f"Delta: {option_result['delta']:.3f}")
    print(f"Gamma: {option_result['gamma']:.3f}")
    print(f"Theta: {option_result['theta']:.3f}")
    print(f"Vega: {option_result['vega']:.3f}")
    
    # Bond pricing example
    print("\n2. Bond Pricing:")
    bond_result = price_bond(face_value=1000, coupon_rate=0.05, years_to_maturity=5, yield_rate=0.04)
    print(f"Bond Price: ${bond_result['price']:.2f}")
    print(f"Duration: {bond_result['duration']:.2f} years")
    
    # Swap pricing example
    print("\n3. Interest Rate Swap:")
    swap_result = price_swap(notional=1000000, fixed_rate=0.05, floating_rate=0.04, years_to_maturity=2)
    print(f"Swap PV: ${swap_result['present_value']:.2f}")
    print(f"Par Swap Rate: {swap_result['par_swap_rate']:.4f} ({swap_result['par_swap_rate']*100:.2f}%)")
