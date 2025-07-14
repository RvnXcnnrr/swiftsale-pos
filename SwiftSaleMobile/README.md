# SwiftSale Mobile - React Native POS App

A comprehensive mobile Point of Sale (POS) application built with React Native and Expo, designed to work seamlessly with the SwiftSale backend system.

## 🚀 Features

### Core POS Functionality
- **Product Management**: Browse, search, and filter products
- **Barcode Scanning**: Camera-based barcode scanning for quick product lookup
- **Shopping Cart**: Add, remove, and modify quantities in cart
- **Payment Processing**: Support for cash and card payments
- **Receipt Generation**: Print and share receipts
- **Customer Management**: Select and manage customers

### Mobile-Optimized Features
- **Touch-Friendly Interface**: Optimized for mobile touch interactions
- **Offline Capability**: Basic offline functionality with data sync
- **Real-time Updates**: Live inventory and sales data
- **Responsive Design**: Works on phones and tablets
- **Dark/Light Theme**: Adaptive theming support

### Business Features
- **Sales History**: View and track all sales transactions
- **Dashboard Analytics**: Key business metrics and insights
- **User Management**: Role-based access control
- **Multi-language Support**: Ready for internationalization

## 📱 Screenshots

*Screenshots will be added after testing on device*

## 🛠 Technology Stack

- **React Native**: Cross-platform mobile development
- **Expo**: Development platform and tools
- **Redux Toolkit**: State management
- **React Native Paper**: Material Design components
- **React Navigation**: Navigation library
- **Expo Camera**: Barcode scanning
- **Expo Print**: Receipt printing
- **Axios**: HTTP client for API calls

## 📋 Prerequisites

- Node.js 16.x or higher
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- Expo Go app on your mobile device (for testing)

## 🚀 Installation

1. **Clone the repository**
   ```bash
   cd SwiftSaleMobile
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API endpoint**
   Edit `src/constants/api.js` and update the `BASE_URL`:
   ```javascript
   export const API_CONFIG = {
     BASE_URL: 'http://your-backend-url.com/api', // Update this
     // ... other config
   };
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Run on device**
   - Install Expo Go app on your mobile device
   - Scan the QR code displayed in terminal/browser
   - The app will load on your device

## 📱 Running on Simulators

### iOS Simulator (macOS only)
```bash
npm run ios
```

### Android Emulator
```bash
npm run android
```

### Web Browser
```bash
npm run web
```

## 🔧 Configuration

### API Configuration
Update the API configuration in `src/constants/api.js`:

```javascript
export const API_CONFIG = {
  BASE_URL: 'http://localhost:8000/api', // Your SwiftSale backend URL
  TIMEOUT: 30000,
  // ... endpoints configuration
};
```

### App Configuration
Update app settings in `app.json`:

```json
{
  "expo": {
    "name": "SwiftSale Mobile",
    "slug": "swiftsale-mobile",
    // ... other settings
  }
}
```

## 🏗 Project Structure

```
SwiftSaleMobile/
├── src/
│   ├── components/          # Reusable UI components
│   ├── screens/            # Screen components
│   │   ├── auth/           # Authentication screens
│   │   ├── pos/            # POS-related screens
│   │   ├── products/       # Product management screens
│   │   ├── sales/          # Sales history screens
│   │   └── customers/      # Customer management screens
│   ├── navigation/         # Navigation configuration
│   ├── store/              # Redux store and slices
│   ├── services/           # API services
│   ├── constants/          # App constants and themes
│   ├── hooks/              # Custom React hooks
│   └── utils/              # Utility functions
├── assets/                 # Static assets (images, fonts)
├── App.js                  # Main app component
├── app.json               # Expo configuration
└── package.json           # Dependencies and scripts
```

## 🔐 Authentication

The app uses token-based authentication with the SwiftSale backend:

1. Login with email and password
2. Token is stored securely using Expo SecureStore
3. Token is automatically included in API requests
4. Auto-logout on token expiration

## 📊 State Management

The app uses Redux Toolkit for state management with the following slices:

- **authSlice**: User authentication and session management
- **cartSlice**: Shopping cart state and operations
- **productSlice**: Product data and filtering
- **customerSlice**: Customer management
- **posSlice**: POS operations and sales
- **offlineSlice**: Offline functionality and sync

## 🔄 Offline Functionality

The app includes basic offline capabilities:

- **Local Storage**: Critical data cached locally
- **Offline Queue**: Sales queued when offline
- **Auto Sync**: Data synced when connection restored
- **Status Indicator**: Shows online/offline status

## 🧪 Testing

### Running Tests
```bash
npm test
```

### Testing on Device
1. Install Expo Go app
2. Scan QR code from `npm start`
3. Test all features thoroughly

## 📦 Building for Production

### Create Development Build
```bash
expo build:android
expo build:ios
```

### Create Production Build
```bash
expo build:android --type app-bundle
expo build:ios --type archive
```

## 🚀 Deployment

### Expo Application Services (EAS)
1. Install EAS CLI: `npm install -g eas-cli`
2. Configure: `eas build:configure`
3. Build: `eas build --platform all`
4. Submit: `eas submit`

### Manual Deployment
- **Android**: Upload APK/AAB to Google Play Store
- **iOS**: Upload IPA to App Store Connect

## 🔧 Troubleshooting

### Common Issues

1. **Metro bundler issues**
   ```bash
   npx expo start --clear
   ```

2. **Node modules issues**
   ```bash
   rm -rf node_modules
   npm install
   ```

3. **Cache issues**
   ```bash
   npx expo start --clear
   ```

### API Connection Issues
- Ensure backend is running and accessible
- Check API_CONFIG.BASE_URL is correct
- Verify network connectivity
- Check CORS settings on backend

## 📝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Contact: support@swiftsale.com
- Documentation: [SwiftSale Docs](https://docs.swiftsale.com)

## 🙏 Acknowledgments

- React Native community
- Expo team
- Material Design team
- SwiftSale backend developers
