# Simple Market Pricers

A modern web application for pricing financial instruments including Options, Bonds, and Interest Rate Swaps. Built with Next.js, React, and Python for accurate financial calculations.

## Features

- **User Authentication**: Secure login and registration system
- **Option Pricing**: Black-Scholes model with Greeks calculation (Delta, Gamma, Vega, Theta)
- **Bond Pricing**: Fixed-coupon bond pricing with yield-to-maturity and duration
- **Swap Pricing**: Plain-vanilla interest rate swap valuation
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Real-time Calculations**: Instant pricing results as you adjust parameters

## Prerequisites

- Node.js (v14 or higher)
- Python 3.x
- MongoDB (for user authentication)
- npm or yarn

## Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd simple-pricer
   ```

2. **Install frontend dependencies:**
   ```bash
   cd frontend
   npm install
   ```

3. **Install Python dependencies:**
   ```bash
   pip install flask flask-cors pymongo pyjwt
   ```

4. **Set up MongoDB:**
   - Install MongoDB locally or use a cloud service like MongoDB Atlas
   - Update the connection string in `api.py` if needed

## Running the Application

1. **Start the Python backend server:**
   ```bash
   python api.py
   ```
   This starts the Flask server on `http://localhost:5000`

2. **Start the Next.js frontend:**
   ```bash
   cd frontend
   npm run dev
   ```
   This starts the development server on `http://localhost:3000`

3. **Access the application:**
   Open your browser and navigate to `http://localhost:3000`

## Usage

### Authentication
- Navigate to the login page to sign in with existing credentials
- New users can register through the signup page
- All pricing features require authentication

### Option Pricing (Black-Scholes)
Parameters:
- **Option Type**: Call or Put
- **Spot Price (S)**: Current price of the underlying asset
- **Strike Price (K)**: Exercise price of the option
- **Time to Expiry (T)**: Time until option expiration (in years)
- **Risk-Free Rate (r)**: Risk-free interest rate
- **Volatility (σ)**: Volatility of the underlying asset

Results include:
- Option Price
- Delta (sensitivity to spot price)
- Gamma (sensitivity of delta)
- Theta (sensitivity to time)
- Vega (sensitivity to volatility)

### Bond Pricing
Parameters:
- **Face Value**: Principal amount of the bond
- **Coupon Rate**: Annual coupon payment as percentage
- **Years to Maturity**: Time until bond expiration
- **Yield Rate**: Required rate of return
- **Payments per Year**: Frequency of coupon payments

Results include:
- Bond Price
- Duration (interest rate sensitivity)

### Swap Pricing
Parameters:
- **Notional Amount**: Principal amount of the swap
- **Fixed Rate**: Fixed interest rate
- **Floating Rate**: Floating interest rate
- **Years to Maturity**: Time until swap expiration
- **Payments per Year**: Frequency of payments

Results include:
- Present Value of the swap
- Par Swap Rate

## Project Structure

```
simple-pricer/
├── frontend/                 # Next.js frontend application
│   ├── src/
│   │   ├── app/              # App Router pages and API routes
│   │   ├── components/       # React components
│   │   ├── context/          # React context providers
│   │   └── services/         # API service layer
│   └── ...
├── api.py                    # Flask backend server
├── pricers.py                # Python financial pricing models
└── tests/                    # Unit tests for pricing models
```

## Technologies Used

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Python, Flask
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Styling**: CSS3 with modern animations and glassmorphism effects
- **UI Components**: Framer Motion for animations

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Financial pricing models based on industry-standard methodologies
- UI/UX design inspired by modern financial applications
- Thanks to all contributors who have helped improve this project