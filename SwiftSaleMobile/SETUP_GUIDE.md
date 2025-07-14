# SwiftSale Mobile - Setup Guide

## 🚀 Quick Start

### 1. Prerequisites
- Node.js 16+ installed
- Android Studio with emulator OR physical Android device
- Expo Go app installed on your device (for testing)

### 2. Installation Steps

1. **Navigate to the mobile app directory:**
   ```bash
   cd SwiftSaleMobile
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure your backend URL:**
   Edit `src/constants/api.js` and update the BASE_URL:
   ```javascript
   export const API_CONFIG = {
     BASE_URL: 'http://YOUR_BACKEND_IP:8000/api', // Replace with your actual backend URL
     // For local development, use your computer's IP address, not localhost
   };
   ```

4. **Start the development server:**
   ```bash
   npm start
   ```

### 3. Running on Device/Emulator

#### Option A: Physical Device (Recommended)
1. Install Expo Go from Google Play Store
2. Scan the QR code displayed in your terminal
3. The app will load automatically

#### Option B: Android Emulator
1. Make sure your emulator is running
2. In the Expo terminal, press `a` to open on Android
3. Wait for the app to build and install

### 4. Backend Configuration

Make sure your SwiftSale backend is running and accessible:

1. **Start your Laravel backend:**
   ```bash
   cd /path/to/your/swiftsale/backend
   php artisan serve --host=0.0.0.0 --port=8000
   ```

2. **Update API URL in mobile app:**
   - Find your computer's IP address
   - Update `src/constants/api.js` with: `http://YOUR_IP:8000/api`

### 5. Testing the App

#### Default Login Credentials
Use the same credentials as your SwiftSale web application:
- Email: admin@example.com (or your admin email)
- Password: your admin password

#### Key Features to Test
1. **Login** - Test authentication
2. **Dashboard** - View sales statistics
3. **POS** - Add products to cart, process sales
4. **Barcode Scanner** - Test camera permissions and scanning
5. **Products** - Browse and search products
6. **Sales History** - View past transactions

## 🔧 Troubleshooting

### Common Issues

#### 1. "Network Error" or API not connecting
- Check that your backend is running
- Verify the IP address in `src/constants/api.js`
- Make sure your device/emulator is on the same network
- Try using your computer's IP instead of localhost

#### 2. "Expo Go not installing" on emulator
- Make sure the emulator is fully booted
- Try restarting the emulator
- Use a physical device instead (recommended)

#### 3. Camera permissions for barcode scanning
- Grant camera permissions when prompted
- On emulator, camera might not work properly
- Use a physical device for barcode testing

#### 4. App crashes or won't load
- Check the terminal for error messages
- Try clearing Metro cache: `npx expo start --clear`
- Restart the development server

### Network Configuration

#### For Local Development:
```javascript
// src/constants/api.js
export const API_CONFIG = {
  BASE_URL: 'http://192.168.1.100:8000/api', // Replace with your IP
  // ...
};
```

#### For Production:
```javascript
// src/constants/api.js
export const API_CONFIG = {
  BASE_URL: 'https://your-domain.com/api',
  // ...
};
```

## 📱 Device Testing Tips

### Android Emulator Setup
1. Use API level 28+ for best compatibility
2. Enable hardware acceleration
3. Allocate sufficient RAM (4GB+)
4. Enable camera support if testing barcode scanning

### Physical Device Testing
1. Enable Developer Options
2. Enable USB Debugging
3. Install Expo Go from Play Store
4. Connect to same WiFi network as development machine

## 🔐 Security Notes

### Development
- The app stores authentication tokens securely using Expo SecureStore
- API calls include proper authentication headers
- Form data is validated before submission

### Production Deployment
- Update API URLs to use HTTPS
- Configure proper CORS settings on backend
- Test on multiple devices and screen sizes
- Implement proper error handling and offline support

## 📊 Performance Tips

### Optimization
- Images are cached automatically
- API responses are cached for offline use
- Redux state is persisted locally
- Lazy loading for large product lists

### Memory Management
- Product images are optimized for mobile
- Large lists use virtualization
- Unused screens are unmounted automatically

## 🚀 Next Steps

1. **Test all features thoroughly**
2. **Configure your backend API endpoints**
3. **Customize the app theme and branding**
4. **Add your company logo and colors**
5. **Test offline functionality**
6. **Prepare for production deployment**

## 📞 Support

If you encounter issues:
1. Check this troubleshooting guide
2. Review the main README.md
3. Check the terminal output for error messages
4. Ensure your backend is properly configured

## 🎯 Production Checklist

Before deploying to production:
- [ ] Update API URLs to production endpoints
- [ ] Test on multiple devices
- [ ] Verify all permissions work correctly
- [ ] Test offline functionality
- [ ] Configure app icons and splash screens
- [ ] Set up proper error tracking
- [ ] Test payment processing thoroughly
- [ ] Verify receipt printing works
- [ ] Test barcode scanning with real products
