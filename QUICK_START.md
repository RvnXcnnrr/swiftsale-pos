# SwiftSale POS - Quick Start Guide

## 🚀 5-Minute Setup

Get SwiftSale running in 5 minutes with this quick setup guide.

### Prerequisites
- PHP 8.1+, Composer, Node.js 16+, MySQL 8.0+
- Basic command line knowledge

### Step 1: Clone and Install
```bash
# Clone repository
git clone https://github.com/your-username/SwiftSale.git
cd SwiftSale

# Install dependencies
composer install
npm install

# Setup environment
cp .env.example .env
php artisan key:generate
```

### Step 2: Database Setup
```bash
# Create database
mysql -u root -p -e "CREATE DATABASE swiftsale_pos;"

# Configure .env file
DB_DATABASE=swiftsale_pos
DB_USERNAME=root
DB_PASSWORD=your_password

# Run migrations
php artisan migrate --seed
```

### Step 3: Build and Run
```bash
# Build assets
npm run dev
npm run rtl

# Create storage link
php artisan storage:link

# Start server
php artisan serve
```

### Step 4: Login
- URL: `http://localhost:8000`
- Email: `admin@swiftsale.com`
- Password: `password`

**🎉 You're ready to go!**

---

## 📋 Essential First Steps

### 1. Change Default Password
- Profile → Change Password
- Use a strong password

### 2. Company Setup
- Settings → Company Settings
- Add your business information

### 3. Create Warehouse
- Inventory → Warehouses → Add Warehouse
- At least one warehouse is required

### 4. Add Products
- Products → Add Product
- Or use Products → Import for bulk upload

### 5. Test POS
- Click POS in menu
- Add products to cart
- Complete a test sale

---

## 🛠 Development Setup

### Hot Reload Development
```bash
# Terminal 1: Laravel server
php artisan serve

# Terminal 2: Asset watching
npm run watch

# Terminal 3: Database monitoring
php artisan tinker
```

### Common Commands
```bash
# Clear caches
php artisan cache:clear
php artisan config:clear
php artisan route:clear

# Database operations
php artisan migrate:fresh --seed
php artisan db:seed

# Asset building
npm run dev          # Development
npm run production   # Production
npm run rtl          # RTL styles
```

---

## 🔧 Troubleshooting

### Permission Issues
```bash
chmod -R 775 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
```

### Asset Build Errors
```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
npm run dev
```

### Database Connection
- Check MySQL is running
- Verify credentials in `.env`
- Test connection: `php artisan migrate:status`

---

## 📚 Key Features Overview

### 🛒 Point of Sale
- Intuitive POS interface
- Barcode scanning support
- Multiple payment methods
- Receipt printing

### 📦 Inventory Management
- Real-time stock tracking
- Multi-warehouse support
- Stock alerts and adjustments
- Product categorization

### 👥 Customer Management
- Customer database
- Purchase history
- Customer analytics

### 📊 Reporting
- Sales reports
- Inventory reports
- Financial analytics
- Dashboard insights

### 🔐 User Management
- Role-based access
- Multiple user accounts
- Permission control

---

## 🎯 Next Steps

1. **Read Full Documentation**: Check `README.md`
2. **Follow Tutorial**: Complete `TUTORIAL.md`
3. **Customize Settings**: Configure for your business
4. **Import Data**: Add your products and customers
5. **Train Staff**: Teach team members to use the system

---

## 📞 Support

- **Documentation**: README.md and TUTORIAL.md
- **Issues**: GitHub Issues
- **Community**: GitHub Discussions

**Happy selling! 🛍️**
