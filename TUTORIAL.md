# SwiftSale POS System - Step-by-Step Tutorial

## 🎯 Tutorial Overview

This tutorial will guide you through setting up and using the SwiftSale POS system from scratch. By the end of this tutorial, you'll have a fully functional POS system and understand how to perform all major operations.

## 📚 What You'll Learn

1. Complete system installation and setup
2. Initial configuration and data setup
3. Product and inventory management
4. Customer management
5. Point of Sale operations
6. Reporting and analytics
7. User management and permissions
8. System maintenance

## ⏱️ Estimated Time

- **Complete Tutorial**: 2-3 hours
- **Basic Setup**: 30-45 minutes
- **Advanced Features**: 1-2 hours

---

## 🚀 Part 1: Installation and Initial Setup (30 minutes)

### Step 1: System Requirements Check (5 minutes)

Before starting, ensure your system meets the requirements:

**Check PHP Version:**
```bash
php --version
# Should show PHP 8.1 or higher
```

**Check Composer:**
```bash
composer --version
# Should show Composer 2.x
```

**Check Node.js:**
```bash
node --version
npm --version
# Node.js 16+ and NPM 8+
```

**Check MySQL:**
```bash
mysql --version
# MySQL 8.0+ or MariaDB 10.4+
```

### Step 2: Download and Install (15 minutes)

**1. Clone or Download SwiftSale:**
```bash
# If using Git
git clone https://github.com/your-username/SwiftSale.git
cd SwiftSale

# Or extract downloaded ZIP file
cd /path/to/extracted/SwiftSale
```

**2. Install PHP Dependencies:**
```bash
composer install
```

**3. Install Node.js Dependencies:**
```bash
npm install
```

**4. Set Up Environment:**
```bash
cp .env.example .env
php artisan key:generate
```

### Step 3: Database Setup (10 minutes)

**1. Create Database:**
```sql
-- Connect to MySQL as root
mysql -u root -p

-- Create database
CREATE DATABASE swiftsale_pos CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create user (optional but recommended)
CREATE USER 'swiftsale_user'@'localhost' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON swiftsale_pos.* TO 'swiftsale_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

**2. Configure Database in .env:**
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=swiftsale_pos
DB_USERNAME=swiftsale_user
DB_PASSWORD=secure_password
```

**3. Run Migrations and Seeders:**
```bash
php artisan migrate
php artisan db:seed
```

**4. Set Up Storage:**
```bash
php artisan storage:link
chmod -R 775 storage bootstrap/cache
```

**5. Build Frontend Assets:**
```bash
npm run dev
npm run rtl
```

**6. Start the Application:**
```bash
php artisan serve
```

Visit `http://localhost:8000` - you should see the SwiftSale login page!

---

## 🔐 Part 2: First Login and Basic Configuration (20 minutes)

### Step 1: Initial Login (2 minutes)

**Default Credentials:**
- **Email**: `admin@swiftsale.com`
- **Password**: `password`

1. Navigate to `http://localhost:8000`
2. Click "Login"
3. Enter the default credentials
4. You'll be redirected to the dashboard

### Step 2: Change Admin Password (3 minutes)

**⚠️ Important: Change the default password immediately!**

1. Click on your profile icon (top right)
2. Select "Profile Settings"
3. Click "Change Password"
4. Enter current password: `password`
5. Enter new secure password
6. Confirm new password
7. Click "Update Password"

### Step 3: Company Settings (10 minutes)

1. Navigate to **Settings** → **Company Settings**
2. Fill in your company information:
   - **Company Name**: Your Business Name
   - **Email**: your-business@email.com
   - **Phone**: Your business phone
   - **Address**: Complete business address
   - **Tax ID**: Your tax identification number
   - **Currency**: Select your local currency
3. Upload your company logo
4. Click "Save Settings"

### Step 4: System Preferences (5 minutes)

1. Go to **Settings** → **System Settings**
2. Configure:
   - **Default Language**: Choose your preferred language
   - **Date Format**: Select date format
   - **Time Zone**: Set your time zone
   - **Default Warehouse**: Will be created in next section
3. Save settings

---

## 🏢 Part 3: Setting Up Your Business Data (45 minutes)

### Step 1: Create Warehouses (10 minutes)

**Why Warehouses?** Even if you have one location, you need at least one warehouse for inventory tracking.

1. Navigate to **Inventory** → **Warehouses**
2. Click "Add Warehouse"
3. Fill in details:
   - **Name**: Main Store
   - **Email**: warehouse@yourbusiness.com
   - **Phone**: Warehouse phone number
   - **Address**: Complete warehouse address
   - **Country**: Select country
   - **State/City**: Enter location details
4. Click "Save"

**Create Additional Warehouses (if needed):**
- Repeat for multiple locations
- Examples: "Main Store", "Online Store", "Storage Facility"

### Step 2: Set Up Product Categories (10 minutes)

1. Go to **Products** → **Categories**
2. Click "Add Category"
3. Create main categories:

**Example Categories:**
- **Electronics**
  - Smartphones
  - Laptops
  - Accessories
- **Clothing**
  - Men's Wear
  - Women's Wear
  - Children's Wear
- **Home & Garden**
  - Furniture
  - Appliances
  - Decor

**For each category:**
1. Enter category name
2. Add description
3. Upload category image (optional)
4. Click "Save"

### Step 3: Create Brands (5 minutes)

1. Navigate to **Products** → **Brands**
2. Click "Add Brand"
3. Add your product brands:

**Example Brands:**
- Apple
- Samsung
- Nike
- Adidas
- Generic

**For each brand:**
1. Enter brand name
2. Add description
3. Upload brand logo (optional)
4. Click "Save"

### Step 4: Set Up Units of Measurement (5 minutes)

1. Go to **Products** → **Units**
2. Default units are already created, but add any specific ones:

**Common Units:**
- Piece (pcs)
- Kilogram (kg)
- Liter (L)
- Meter (m)
- Box
- Dozen

### Step 5: Configure Payment Methods (5 minutes)

1. Navigate to **Settings** → **Payment Methods**
2. Enable/configure payment methods:
   - **Cash**: Always enabled
   - **Credit Card**: Configure if you accept cards
   - **Bank Transfer**: Add bank details
   - **Digital Payments**: PayPal, Stripe, etc.

### Step 6: Set Up Tax Rates (10 minutes)

1. Go to **Settings** → **Tax Settings**
2. Click "Add Tax Rate"
3. Configure your tax rates:

**Example Tax Setup:**
- **Sales Tax**: 8.5%
- **VAT**: 20%
- **Service Tax**: 5%

**For each tax:**
1. Enter tax name
2. Set tax rate percentage
3. Choose tax type (inclusive/exclusive)
4. Click "Save"

---

## 📦 Part 4: Product Management (30 minutes)

### Step 1: Add Your First Product (10 minutes)

1. Navigate to **Products** → **Add Product**
2. Fill in product details:

**Example Product - iPhone 14:**
- **Product Name**: iPhone 14 128GB
- **Product Code**: IPH14-128
- **Category**: Electronics → Smartphones
- **Brand**: Apple
- **Cost Price**: $700.00
- **Selling Price**: $899.00
- **Unit**: Piece
- **Stock Alert**: 5 (alert when stock falls below 5)
- **Tax Rate**: Select applicable tax
- **Description**: Latest iPhone with advanced features

3. Upload product images:
   - Main product image
   - Additional images (optional)

4. Set inventory:
   - **Initial Stock**: 20
   - **Warehouse**: Main Store

5. Click "Save Product"

### Step 2: Add More Products (15 minutes)

Add at least 5-10 products to test the system properly:

**Product Examples:**
1. **Samsung Galaxy S23** - Electronics
2. **Nike Air Max** - Clothing/Footwear
3. **Coffee Mug** - Home & Kitchen
4. **Wireless Earbuds** - Electronics
5. **T-Shirt** - Clothing

**Quick Add Tips:**
- Use consistent naming conventions
- Include size/color in product name if applicable
- Set realistic stock levels
- Use proper categories and brands

### Step 3: Bulk Import Products (5 minutes)

For larger inventories, use bulk import:

1. Go to **Products** → **Import Products**
2. Download the sample Excel template
3. Fill in your product data
4. Upload the completed file
5. Review and confirm import

**Template includes:**
- Product name, code, category
- Pricing and cost information
- Stock quantities
- Tax and unit information

---

## 👥 Part 5: Customer Management (15 minutes)

### Step 1: Add Individual Customers (10 minutes)

1. Navigate to **Customers** → **Add Customer**
2. Create sample customers:

**Customer 1 - Regular Customer:**
- **Name**: John Smith
- **Email**: john.smith@email.com
- **Phone**: +1-555-0123
- **Address**: 123 Main St, City, State 12345
- **Customer Type**: Regular
- **Credit Limit**: $1,000

**Customer 2 - VIP Customer:**
- **Name**: Sarah Johnson
- **Email**: sarah.j@email.com
- **Phone**: +1-555-0456
- **Address**: 456 Oak Ave, City, State 12345
- **Customer Type**: VIP
- **Credit Limit**: $5,000

**Customer 3 - Walk-in Customer:**
- **Name**: Walk-in Customer
- **Email**: walkin@store.com
- **Phone**: +1-555-0000
- **Address**: Store Location
- **Customer Type**: Walk-in
- **Credit Limit**: $0

### Step 2: Bulk Import Customers (5 minutes)

For existing customer databases:

1. Go to **Customers** → **Import Customers**
2. Download template
3. Fill with customer data
4. Upload and import

---

## 🛒 Part 6: Point of Sale Operations (25 minutes)

### Step 1: Understanding the POS Interface (5 minutes)

1. Click **POS** in the main menu
2. Familiarize yourself with the interface:

**Left Side - Product Selection:**
- Category filters
- Brand filters
- Product search
- Product grid with images and prices

**Right Side - Cart and Checkout:**
- Shopping cart with selected items
- Customer selection
- Payment methods
- Total calculations

**Top Bar:**
- Quick actions (Hold, Clear, etc.)
- User menu
- Calculator

### Step 2: Make Your First Sale (10 minutes)

**Scenario: Customer buys iPhone 14 and Wireless Earbuds**

1. **Select Products:**
   - Click on "iPhone 14 128GB" - it's added to cart
   - Search for "Wireless Earbuds"
   - Click to add to cart

2. **Adjust Quantities:**
   - iPhone: Quantity 1 (default)
   - Earbuds: Change quantity to 2

3. **Select Customer:**
   - Click "Select Customer"
   - Choose "John Smith"
   - Or click "Add Customer" for new customer

4. **Review Cart:**
   - Check items and quantities
   - Verify prices and totals
   - Tax should be calculated automatically

5. **Process Payment:**
   - Select payment method: "Cash"
   - Enter amount received: $1,200
   - System calculates change
   - Click "Complete Sale"

6. **Print Receipt:**
   - Receipt preview appears
   - Click "Print" or "Save PDF"
   - Sale is completed!

### Step 3: Handle Different Sale Scenarios (10 minutes)

**Scenario 1: Partial Payment**
1. Add products to cart
2. Select customer
3. Choose payment method
4. Enter partial amount (less than total)
5. System marks as "Partial Payment"
6. Complete sale - customer owes remaining balance

**Scenario 2: Hold Sale**
1. Add products to cart
2. Click "Hold Sale"
3. Enter reference note: "Customer will return later"
4. Save held sale
5. Cart is cleared for next customer

**Scenario 3: Retrieve Held Sale**
1. Click "Held Sales"
2. Select the held sale
3. Cart is restored with previous items
4. Complete the sale normally

---

## 📊 Part 7: Reports and Analytics (20 minutes)

### Step 1: Dashboard Overview (5 minutes)

1. Navigate to **Dashboard**
2. Review key metrics:
   - **Today's Sales**: Current day revenue
   - **Total Products**: Inventory count
   - **Low Stock Alerts**: Items needing restock
   - **Top Selling Products**: Best performers
   - **Recent Sales**: Latest transactions

### Step 2: Sales Reports (10 minutes)

1. Go to **Reports** → **Sales Reports**

**Daily Sales Report:**
1. Select today's date
2. Choose warehouse: "Main Store"
3. Click "Generate Report"
4. Review:
   - Total sales amount
   - Number of transactions
   - Payment method breakdown
   - Top selling products

**Monthly Sales Report:**
1. Select date range: Last 30 days
2. Generate report
3. Analyze trends and patterns

**Customer Sales Report:**
1. Select specific customer: "John Smith"
2. Choose date range
3. View customer's purchase history

### Step 3: Inventory Reports (5 minutes)

1. Navigate to **Reports** → **Inventory Reports**

**Stock Level Report:**
1. Select warehouse
2. Choose product category (optional)
3. Generate report
4. Review current stock levels

**Low Stock Alert Report:**
1. View products below stock alert level
2. Plan reordering
3. Update stock as needed

**Stock Movement Report:**
1. Select date range
2. View all stock changes
3. Track inventory flow

---

## 👤 Part 8: User Management (15 minutes)

### Step 1: Understanding Roles (5 minutes)

Default roles in SwiftSale:
- **Admin**: Full system access
- **Manager**: Most features except system settings
- **Cashier**: POS and basic operations only
- **Inventory Manager**: Product and stock management

### Step 2: Create New User (10 minutes)

1. Navigate to **Users** → **Add User**
2. Create a cashier account:

**New Cashier:**
- **First Name**: Jane
- **Last Name**: Doe
- **Email**: jane.doe@store.com
- **Phone**: +1-555-0789
- **Password**: SecurePassword123
- **Role**: Cashier
- **Warehouse**: Main Store

3. Click "Save User"
4. New user can now log in with limited permissions

**Test the New User:**
1. Log out from admin account
2. Log in as jane.doe@store.com
3. Notice limited menu options
4. Test POS functionality
5. Log back in as admin

---

## 🔧 Part 9: Advanced Features (25 minutes)

### Step 1: Stock Adjustments (10 minutes)

**Scenario: Received new inventory**

1. Go to **Inventory** → **Stock Adjustments**
2. Click "Add Adjustment"
3. Fill details:
   - **Warehouse**: Main Store
   - **Adjustment Type**: Addition
   - **Reason**: New Stock Received
   - **Reference**: PO-2024-001

4. Add products:
   - **iPhone 14**: +10 units
   - **Wireless Earbuds**: +25 units

5. Save adjustment
6. Check updated stock levels

### Step 2: Product Returns (10 minutes)

**Scenario: Customer returns iPhone 14**

1. Navigate to **Sales** → **Returns**
2. Click "Add Return"
3. Search for original sale
4. Select sale with iPhone 14
5. Choose return items:
   - iPhone 14: Quantity 1
   - Reason: "Customer changed mind"
6. Process return
7. Refund amount calculated
8. Stock automatically updated

### Step 3: Generate Barcodes (5 minutes)

1. Go to **Products** → **Print Barcodes**
2. Select products for barcode printing
3. Choose barcode format (CODE128 recommended)
4. Set label size and layout
5. Generate PDF with barcodes
6. Print labels for products

---

## 🎯 Part 10: Testing and Validation (15 minutes)

### Step 1: Complete Transaction Test (10 minutes)

Perform a complete end-to-end test:

1. **Add products to inventory**
2. **Create a customer**
3. **Make a sale through POS**
4. **Process payment**
5. **Print receipt**
6. **Check inventory reduction**
7. **View sale in reports**
8. **Process a return**
9. **Verify stock restoration**

### Step 2: Multi-User Test (5 minutes)

1. **Admin user**: Create products and customers
2. **Cashier user**: Process sales
3. **Manager user**: View reports
4. Verify role-based access works correctly

---

## 🚀 Part 11: Going Live (10 minutes)

### Step 1: Production Preparation

1. **Backup your data**:
   ```bash
   mysqldump -u username -p swiftsale_pos > backup.sql
   ```

2. **Set production environment**:
   ```env
   APP_ENV=production
   APP_DEBUG=false
   ```

3. **Optimize for production**:
   ```bash
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   npm run production
   ```

### Step 2: Final Checklist

- [ ] All products added with correct pricing
- [ ] Customer database imported/created
- [ ] Staff accounts created with proper roles
- [ ] Payment methods configured
- [ ] Tax rates set correctly
- [ ] Backup system in place
- [ ] Staff trained on system usage

---

## 🎉 Congratulations!

You've successfully set up and learned to use the SwiftSale POS system! You now know how to:

✅ Install and configure the system
✅ Manage products and inventory
✅ Handle customer data
✅ Process sales transactions
✅ Generate reports and analytics
✅ Manage users and permissions
✅ Handle returns and adjustments

## 📚 Next Steps

1. **Explore Advanced Features**: Quotations, transfers, expense tracking
2. **Customize Settings**: Email templates, SMS notifications
3. **Integrate Third-party Services**: Payment gateways, accounting software
4. **Scale Your Business**: Multi-warehouse operations, advanced reporting

## 🆘 Need Help?

- **Documentation**: Refer to the main README.md
- **Community**: Join our GitHub discussions
- **Support**: Contact support for technical issues

**Happy Selling with SwiftSale! 🛒💰**
