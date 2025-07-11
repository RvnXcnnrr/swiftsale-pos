# SwiftSale - Point of Sale (POS) System

<p align="center">
  <img src="https://img.shields.io/badge/Laravel-10.x-red.svg" alt="Laravel Version">
  <img src="https://img.shields.io/badge/React-17.x-blue.svg" alt="React Version">
  <img src="https://img.shields.io/badge/Bootstrap-5.3.7-purple.svg" alt="Bootstrap Version">
  <img src="https://img.shields.io/badge/PHP-8.1+-blue.svg" alt="PHP Version">
  <img src="https://img.shields.io/badge/License-MIT-green.svg" alt="License">
</p>

## 📋 Table of Contents

- [About SwiftSale](#about-swiftsale)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [System Requirements](#system-requirements)
- [Installation Guide](#installation-guide)
- [Configuration](#configuration)
- [How the System Works](#how-the-system-works)
- [User Guide](#user-guide)
- [API Documentation](#api-documentation)
- [Development Guide](#development-guide)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## 🚀 About SwiftSale

SwiftSale is a comprehensive Point of Sale (POS) system built with Laravel and React. It's designed to help businesses manage their sales, inventory, customers, and operations efficiently. The system provides a modern, responsive interface with powerful backend capabilities for retail businesses of all sizes.

### Key Highlights

- **Modern Architecture**: Built with Laravel 10 backend and React 17 frontend
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Multi-language Support**: Supports multiple languages including English, Arabic, French, Spanish, German, Turkish, Vietnamese, and Chinese
- **RTL Support**: Full right-to-left language support
- **Real-time Operations**: Live inventory updates and sales tracking
- **Comprehensive Reporting**: Detailed analytics and business insights

## ✨ Features

### 🛒 Sales Management
- **Point of Sale Interface**: Intuitive POS interface for quick sales processing
- **Barcode Scanning**: Support for multiple barcode formats (CODE128, CODE39, EAN8, UPC, EAN13)
- **Multiple Payment Methods**: Cash, card, and other payment options
- **Hold Sales**: Save incomplete sales for later completion
- **Sales Returns**: Process returns and refunds
- **Quotations**: Create and manage sales quotations

### 📦 Inventory Management
- **Product Management**: Add, edit, and organize products with categories and brands
- **Stock Tracking**: Real-time inventory tracking across multiple warehouses
- **Stock Alerts**: Automatic low-stock notifications
- **Product Variations**: Support for product variants (size, color, etc.)
- **Barcode Generation**: Automatic barcode generation for products
- **Stock Adjustments**: Manual stock adjustments and transfers

### 👥 Customer & Supplier Management
- **Customer Database**: Comprehensive customer information management
- **Supplier Management**: Track suppliers and purchase orders
- **Customer Reports**: Detailed customer analytics and purchase history

### 📊 Reporting & Analytics
- **Dashboard**: Real-time business overview with key metrics
- **Sales Reports**: Detailed sales analytics and trends
- **Inventory Reports**: Stock levels, movement, and valuation reports
- **Customer Reports**: Customer behavior and purchase patterns
- **Financial Reports**: Revenue, profit, and expense tracking

### 🏢 Multi-Warehouse Support
- **Multiple Locations**: Manage inventory across multiple warehouses
- **Stock Transfers**: Transfer inventory between warehouses
- **Location-based Reporting**: Warehouse-specific analytics

### 👤 User Management
- **Role-based Access**: Granular permissions and role management
- **User Profiles**: Individual user accounts with customizable settings
- **Activity Tracking**: User action logging and audit trails

### 🔧 System Features
- **Settings Management**: Comprehensive system configuration
- **Email Templates**: Customizable email notifications
- **SMS Integration**: SMS notifications and alerts
- **PDF Generation**: Automatic invoice and report generation
- **Data Import/Export**: Bulk data operations with Excel support
- **Backup & Restore**: Database backup and restoration capabilities

## 🛠 Technology Stack

### Backend
- **Framework**: Laravel 10.x
- **Language**: PHP 8.1+
- **Database**: MySQL 8.0+
- **Authentication**: Laravel Sanctum
- **File Storage**: Local/AWS S3 support
- **PDF Generation**: DomPDF
- **Excel Operations**: Maatwebsite Excel
- **Permissions**: Spatie Laravel Permission

### Frontend
- **Framework**: React 17.x
- **UI Library**: React Bootstrap 5.3.7
- **State Management**: Redux with Redux Thunk
- **Routing**: React Router DOM 6.x
- **HTTP Client**: Axios
- **Charts**: Chart.js & ECharts
- **Internationalization**: React Intl
- **Styling**: SCSS/SASS with RTL support

### Development Tools
- **Build Tool**: Laravel Mix with Webpack
- **Package Manager**: NPM
- **CSS Preprocessor**: SASS/SCSS
- **Code Quality**: ESLint, Prettier
- **Version Control**: Git

### Third-party Integrations
- **Barcode Generation**: Picqer PHP Barcode Generator
- **Media Management**: Spatie Laravel Media Library
- **API Pagination**: Spatie Laravel JSON API Paginate
- **Query Builder**: Spatie Laravel Query Builder

## 📋 System Requirements

### Server Requirements
- **PHP**: 8.1 or higher
- **Web Server**: Apache 2.4+ or Nginx 1.18+
- **Database**: MySQL 8.0+ or MariaDB 10.4+
- **Memory**: 512MB RAM minimum (2GB recommended)
- **Storage**: 1GB free disk space minimum

### PHP Extensions
- BCMath PHP Extension
- Ctype PHP Extension
- Fileinfo PHP Extension
- JSON PHP Extension
- Mbstring PHP Extension
- OpenSSL PHP Extension
- PDO PHP Extension
- Tokenizer PHP Extension
- XML PHP Extension
- GD PHP Extension
- cURL PHP Extension

### Development Requirements
- **Node.js**: 16.x or higher
- **NPM**: 8.x or higher
- **Composer**: 2.x
- **Git**: Latest version

### Browser Support
- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+
- **Mobile**: iOS Safari 14+, Chrome Mobile 90+

## 🚀 Installation Guide

### Step 1: Clone the Repository

```bash
# Clone the repository
git clone https://github.com/your-username/SwiftSale.git
cd SwiftSale

# Or if you're setting up from an existing directory
cd /path/to/your/SwiftSale/directory
```

### Step 2: Install PHP Dependencies

```bash
# Install Composer dependencies
composer install

# If you encounter memory issues
composer install --no-dev --optimize-autoloader
```

### Step 3: Install Node.js Dependencies

```bash
# Install NPM dependencies
npm install

# If you encounter issues, try clearing cache
npm cache clean --force
npm install
```

### Step 4: Environment Configuration

```bash
# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate
```

### Step 5: Database Setup

1. **Create Database**:
   ```sql
   CREATE DATABASE swiftsale_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

2. **Configure Database in .env**:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=swiftsale_db
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   ```

3. **Run Migrations and Seeders**:
   ```bash
   # Run database migrations
   php artisan migrate

   # Seed the database with initial data
   php artisan db:seed
   ```

### Step 6: Storage and Permissions

```bash
# Create storage link
php artisan storage:link

# Set proper permissions (Linux/Mac)
chmod -R 775 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache

# For Windows (run as administrator)
icacls storage /grant "IIS_IUSRS:(OI)(CI)F" /T
icacls bootstrap/cache /grant "IIS_IUSRS:(OI)(CI)F" /T
```

### Step 7: Build Frontend Assets

```bash
# Build for development
npm run dev

# Build for production
npm run production

# Build RTL styles
npm run rtl

# Watch for changes during development
npm run watch
```

### Step 8: Configure Web Server

#### Apache Configuration
Create a virtual host or configure your document root to point to the `public` directory:

```apache
<VirtualHost *:80>
    ServerName swiftsale.local
    DocumentRoot /path/to/SwiftSale/public

    <Directory /path/to/SwiftSale/public>
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

#### Nginx Configuration
```nginx
server {
    listen 80;
    server_name swiftsale.local;
    root /path/to/SwiftSale/public;
    index index.php;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.1-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }
}
```

### Step 9: Final Configuration

```bash
# Clear all caches
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear

# Optimize for production (optional)
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

## ⚙️ Configuration

### Environment Variables

Key environment variables you should configure in your `.env` file:

```env
# Application
APP_NAME="SwiftSale POS"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-domain.com

# Database
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=swiftsale_db
DB_USERNAME=your_username
DB_PASSWORD=your_password

# Mail Configuration
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=your-email@gmail.com
MAIL_FROM_NAME="${APP_NAME}"

# File Storage
FILESYSTEM_DISK=local
MEDIA_DISK=public

# Session & Security
SESSION_LIFETIME=120
SANCTUM_TTL=120

# AWS S3 (Optional)
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=your-bucket-name
```

### Default Login Credentials

After installation, you can log in with these default credentials:

- **Email**: `admin@swiftsale.com`
- **Password**: `password`

> ⚠️ **Important**: Change the default password immediately after first login!

### Initial Setup Steps

1. **Login to Admin Panel**: Navigate to `/login` and use default credentials
2. **Change Admin Password**: Go to Profile Settings and update password
3. **Configure Company Settings**: Set up company information, logo, and contact details
4. **Set Up Warehouses**: Create your warehouse locations
5. **Configure Payment Methods**: Set up accepted payment methods
6. **Add Product Categories**: Create product categories and brands
7. **Import Initial Data**: Use the import features to add products, customers, and suppliers

## 🔧 How the System Works

### System Architecture

SwiftSale follows a modern **Single Page Application (SPA)** architecture:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend │    │  Laravel Backend │    │   MySQL Database │
│                 │    │                 │    │                 │
│  - User Interface│◄──►│  - API Endpoints│◄──►│  - Data Storage │
│  - State Management│  │  - Business Logic│    │  - Relationships│
│  - Routing      │    │  - Authentication│    │  - Indexing     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Data Flow

1. **User Interaction**: User interacts with React frontend
2. **API Request**: Frontend sends HTTP requests to Laravel API
3. **Authentication**: Laravel Sanctum validates user tokens
4. **Business Logic**: Laravel controllers process the request
5. **Database Operations**: Eloquent ORM handles database interactions
6. **Response**: JSON response sent back to frontend
7. **State Update**: Redux updates application state
8. **UI Update**: React re-renders components with new data

### Core Modules

#### 1. Authentication Module
- **Login/Logout**: Secure user authentication
- **Password Reset**: Email-based password recovery
- **Token Management**: API token generation and validation
- **Session Handling**: User session management

#### 2. POS (Point of Sale) Module
- **Product Search**: Real-time product search by name/barcode
- **Cart Management**: Add/remove items, quantity updates
- **Payment Processing**: Multiple payment method support
- **Receipt Generation**: PDF receipt generation
- **Hold Sales**: Save incomplete transactions

#### 3. Inventory Management Module
- **Stock Tracking**: Real-time inventory levels
- **Product Management**: CRUD operations for products
- **Category Management**: Product categorization
- **Warehouse Management**: Multi-location inventory
- **Stock Adjustments**: Manual stock corrections

#### 4. Sales Management Module
- **Sales Recording**: Complete sales transaction processing
- **Sales History**: Historical sales data and search
- **Returns Processing**: Handle product returns
- **Payment Tracking**: Payment status and history

#### 5. Customer Management Module
- **Customer Database**: Customer information storage
- **Purchase History**: Customer transaction history
- **Customer Analytics**: Purchase patterns and insights

#### 6. Reporting Module
- **Dashboard Analytics**: Real-time business metrics
- **Sales Reports**: Detailed sales analysis
- **Inventory Reports**: Stock levels and movement
- **Financial Reports**: Revenue and profit analysis

### Database Schema Overview

#### Core Tables
- **users**: System users and authentication
- **products**: Product information and pricing
- **product_categories**: Product categorization
- **warehouses**: Storage locations
- **customers**: Customer information
- **sales**: Sales transactions
- **sale_items**: Individual sale line items
- **manage_stocks**: Inventory tracking
- **sales_payments**: Payment records

#### Key Relationships
- Products belong to categories and brands
- Sales have multiple sale items
- Sale items reference products
- Stock is tracked per warehouse
- Users have roles and permissions

### API Structure

The system uses RESTful API endpoints:

```
GET    /api/products           # List products
POST   /api/products           # Create product
GET    /api/products/{id}      # Show product
PUT    /api/products/{id}      # Update product
DELETE /api/products/{id}      # Delete product

GET    /api/sales              # List sales
POST   /api/sales              # Create sale
GET    /api/sales/{id}         # Show sale
PUT    /api/sales/{id}         # Update sale

GET    /api/customers          # List customers
POST   /api/customers          # Create customer
```

### Frontend Architecture

#### Component Structure
```
src/
├── components/           # Reusable UI components
│   ├── dashboard/       # Dashboard components
│   ├── sales/          # Sales management
│   ├── product/        # Product management
│   ├── customer/       # Customer management
│   └── settings/       # System settings
├── shared/             # Shared utilities
├── store/              # Redux store and actions
├── locales/            # Internationalization
└── assets/             # Static assets
```

#### State Management
- **Redux**: Centralized state management
- **Actions**: API calls and state updates
- **Reducers**: State transformation logic
- **Middleware**: Redux Thunk for async operations

#### Routing
- **React Router**: Client-side routing
- **Protected Routes**: Authentication-based access
- **Dynamic Loading**: Code splitting for performance

## 📖 User Guide

### Getting Started

#### First Login
1. Navigate to your SwiftSale URL
2. Click "Login" and enter default credentials
3. You'll be redirected to the dashboard
4. Immediately change your password in Profile Settings

#### Dashboard Overview
The dashboard provides a comprehensive overview of your business:

- **Today's Sales**: Current day sales total
- **Total Revenue**: Overall revenue metrics
- **Inventory Alerts**: Low stock notifications
- **Recent Transactions**: Latest sales activity
- **Top Products**: Best-selling items
- **Customer Analytics**: Customer insights

### Core Operations

#### 1. Product Management

**Adding a New Product:**
1. Navigate to **Products** → **Add Product**
2. Fill in product details:
   - Name and description
   - Product code/SKU
   - Category and brand
   - Cost and selling price
   - Stock quantity
   - Barcode (auto-generated or custom)
3. Upload product images
4. Set tax rates and units
5. Click **Save**

**Managing Categories:**
1. Go to **Products** → **Categories**
2. Click **Add Category**
3. Enter category name and description
4. Set category image (optional)
5. Save the category

**Bulk Import:**
1. Navigate to **Products** → **Import**
2. Download the sample Excel template
3. Fill in your product data
4. Upload the completed file
5. Review and confirm import

#### 2. Point of Sale (POS) Operations

**Making a Sale:**
1. Access the POS interface from the main menu
2. Search for products by:
   - Typing product name
   - Scanning barcode
   - Browsing categories
3. Add items to cart
4. Adjust quantities as needed
5. Select customer (optional)
6. Choose payment method
7. Process payment
8. Print receipt

**Handling Returns:**
1. Go to **Sales** → **Returns**
2. Search for original sale
3. Select items to return
4. Specify return reason
5. Process refund
6. Update inventory

**Managing Held Sales:**
1. In POS, click **Hold Sale**
2. Enter reference note
3. Save for later
4. Retrieve from **Held Sales** list
5. Complete when ready

#### 3. Inventory Management

**Stock Adjustments:**
1. Navigate to **Inventory** → **Adjustments**
2. Select warehouse
3. Choose adjustment type:
   - Addition (stock received)
   - Subtraction (stock lost/damaged)
4. Enter quantities and reasons
5. Save adjustment

**Stock Transfers:**
1. Go to **Inventory** → **Transfers**
2. Select source warehouse
3. Choose destination warehouse
4. Add products and quantities
5. Process transfer
6. Confirm receipt at destination

**Setting Stock Alerts:**
1. Edit product details
2. Set **Stock Alert** level
3. System will notify when stock falls below this level
4. Configure notification preferences in settings

#### 4. Customer Management

**Adding Customers:**
1. Navigate to **Customers** → **Add Customer**
2. Enter customer information:
   - Name and contact details
   - Address information
   - Tax ID (if applicable)
3. Set credit limit (optional)
4. Save customer

**Customer Analytics:**
1. View customer list
2. Click on customer name
3. Review purchase history
4. Analyze buying patterns
5. Generate customer reports

#### 5. Reporting and Analytics

**Sales Reports:**
1. Go to **Reports** → **Sales**
2. Select date range
3. Choose filters:
   - Warehouse
   - Customer
   - Product category
4. Generate report
5. Export to PDF/Excel

**Inventory Reports:**
1. Navigate to **Reports** → **Inventory**
2. Select report type:
   - Stock levels
   - Stock movement
   - Low stock alerts
3. Apply filters
4. View and export results

**Financial Reports:**
1. Access **Reports** → **Financial**
2. Choose report period
3. Review metrics:
   - Revenue trends
   - Profit margins
   - Expense analysis
4. Export for accounting

### Advanced Features

#### Multi-Warehouse Operations
1. **Setup**: Configure multiple warehouse locations
2. **Stock Distribution**: Allocate inventory across warehouses
3. **Transfers**: Move stock between locations
4. **Reporting**: Generate warehouse-specific reports

#### User Management
1. **Roles**: Create custom user roles
2. **Permissions**: Set granular access controls
3. **User Accounts**: Manage staff accounts
4. **Activity Logs**: Track user actions

#### System Configuration
1. **Company Settings**: Configure business information
2. **Tax Settings**: Set up tax rates and rules
3. **Payment Methods**: Configure accepted payment types
4. **Email Templates**: Customize notification emails
5. **Backup Settings**: Configure automatic backups

### Mobile Usage

SwiftSale is fully responsive and works on mobile devices:

- **Touch-Friendly**: Optimized for touch interactions
- **Barcode Scanning**: Use device camera for scanning
- **Offline Capability**: Limited offline functionality
- **Mobile POS**: Full POS functionality on tablets

### Keyboard Shortcuts

Speed up your workflow with keyboard shortcuts:

- **F1**: Open POS
- **F2**: Add new product
- **F3**: Search products
- **F4**: Customer lookup
- **Ctrl + S**: Save current form
- **Esc**: Close modal/cancel action

### Best Practices

#### Daily Operations
1. **Start of Day**: Check stock alerts and pending orders
2. **Regular Backups**: Ensure data is backed up regularly
3. **End of Day**: Review sales reports and reconcile cash
4. **Stock Checks**: Perform regular inventory counts

#### Data Management
1. **Regular Cleanup**: Archive old data periodically
2. **Category Organization**: Keep product categories organized
3. **Customer Data**: Keep customer information updated
4. **Price Updates**: Review and update prices regularly

#### Security
1. **Password Policy**: Use strong passwords
2. **User Access**: Limit access based on roles
3. **Regular Updates**: Keep system updated
4. **Backup Strategy**: Maintain regular backups

## 🔌 API Documentation

### Authentication

SwiftSale uses Laravel Sanctum for API authentication. All API requests require a valid token.

#### Login
```http
POST /api/login
Content-Type: application/json

{
    "email": "admin@swiftsale.com",
    "password": "password"
}
```

**Response:**
```json
{
    "success": true,
    "data": {
        "token": "1|abc123...",
        "user": {
            "id": 1,
            "first_name": "Admin",
            "last_name": "User",
            "email": "admin@swiftsale.com"
        }
    }
}
```

#### Using the Token
Include the token in the Authorization header:
```http
Authorization: Bearer 1|abc123...
```

### Core API Endpoints

#### Products API

**List Products**
```http
GET /api/products
Authorization: Bearer {token}
```

**Create Product**
```http
POST /api/products
Authorization: Bearer {token}
Content-Type: application/json

{
    "name": "Product Name",
    "code": "PROD001",
    "product_category_id": 1,
    "brand_id": 1,
    "product_cost": 10.00,
    "product_price": 15.00,
    "stock_alert": 5
}
```

**Update Product**
```http
PUT /api/products/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
    "name": "Updated Product Name",
    "product_price": 16.00
}
```

#### Sales API

**Create Sale**
```http
POST /api/sales
Authorization: Bearer {token}
Content-Type: application/json

{
    "customer_id": 1,
    "warehouse_id": 1,
    "sale_items": [
        {
            "product_id": 1,
            "quantity": 2,
            "unit_price": 15.00
        }
    ],
    "payment_type": 1,
    "paid_amount": 30.00
}
```

**Get Sale Details**
```http
GET /api/sales/{id}
Authorization: Bearer {token}
```

#### Customers API

**List Customers**
```http
GET /api/customers
Authorization: Bearer {token}
```

**Create Customer**
```http
POST /api/customers
Authorization: Bearer {token}
Content-Type: application/json

{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "address": "123 Main St"
}
```

### API Response Format

All API responses follow this structure:

**Success Response:**
```json
{
    "success": true,
    "data": {
        // Response data
    },
    "message": "Operation successful"
}
```

**Error Response:**
```json
{
    "success": false,
    "message": "Error description",
    "errors": {
        "field": ["Validation error message"]
    }
}
```

### Pagination

List endpoints support pagination:

```http
GET /api/products?page=1&per_page=15
```

**Paginated Response:**
```json
{
    "success": true,
    "data": [
        // Items array
    ],
    "meta": {
        "current_page": 1,
        "last_page": 5,
        "per_page": 15,
        "total": 75
    }
}
```

### Filtering and Searching

Most list endpoints support filtering:

```http
GET /api/products?search=laptop&category_id=1&sort=name&order=asc
```

Common parameters:
- `search`: Text search
- `sort`: Sort field
- `order`: Sort direction (asc/desc)
- `per_page`: Items per page
- `page`: Page number

## 🛠 Development Guide

### Setting Up Development Environment

#### Prerequisites
1. Install PHP 8.1+, Composer, Node.js 16+, and MySQL
2. Clone the repository
3. Follow the installation guide above

#### Development Workflow

**Backend Development:**
```bash
# Start Laravel development server
php artisan serve

# Watch for file changes
php artisan serve --host=0.0.0.0 --port=8000

# Run migrations during development
php artisan migrate:fresh --seed
```

**Frontend Development:**
```bash
# Start development build with watching
npm run watch

# Start hot reload (if configured)
npm run hot

# Build for production
npm run production
```

### Project Structure

```
SwiftSale/
├── app/                    # Laravel application code
│   ├── Http/Controllers/   # API controllers
│   ├── Models/            # Eloquent models
│   ├── Services/          # Business logic services
│   └── helpers.php        # Helper functions
├── database/              # Database files
│   ├── migrations/        # Database migrations
│   ├── seeders/          # Database seeders
│   └── factories/        # Model factories
├── resources/             # Frontend and views
│   ├── pos/src/          # React application
│   ├── views/            # Blade templates
│   └── lang/             # Language files
├── routes/               # Route definitions
│   ├── api.php          # API routes
│   ├── web.php          # Web routes
│   └── m1.php           # Mobile API routes
├── public/              # Public assets
├── storage/             # File storage
└── tests/              # Test files
```

### Coding Standards

#### PHP (Laravel)
- Follow PSR-12 coding standards
- Use meaningful variable and method names
- Add proper docblocks for classes and methods
- Use type hints where possible

```php
<?php

namespace App\Http\Controllers\API;

use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductController extends AppBaseController
{
    /**
     * Display a listing of products.
     */
    public function index(Request $request): JsonResponse
    {
        $products = Product::query()
            ->when($request->search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->paginate($request->per_page ?? 15);

        return $this->sendResponse($products, 'Products retrieved successfully');
    }
}
```

#### JavaScript (React)
- Use functional components with hooks
- Follow ESLint configuration
- Use meaningful component and variable names
- Implement proper error handling

```javascript
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../store/actions/productActions';

const ProductList = () => {
    const dispatch = useDispatch();
    const { products, loading, error } = useSelector(state => state.products);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        dispatch(fetchProducts({ search: searchTerm }));
    }, [dispatch, searchTerm]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products..."
            />
            {products.map(product => (
                <div key={product.id}>{product.name}</div>
            ))}
        </div>
    );
};

export default ProductList;
```

### Database Conventions

#### Migration Naming
- Use descriptive names: `create_products_table`
- Include timestamps: `2024_01_15_create_products_table`
- Use snake_case for table and column names

#### Model Relationships
```php
// Product.php
public function category(): BelongsTo
{
    return $this->belongsTo(ProductCategory::class, 'product_category_id');
}

public function saleItems(): HasMany
{
    return $this->hasMany(SaleItem::class);
}

// ProductCategory.php
public function products(): HasMany
{
    return $this->hasMany(Product::class, 'product_category_id');
}
```

### Testing

#### Running Tests
```bash
# Run all tests
php artisan test

# Run specific test file
php artisan test tests/Feature/ProductTest.php

# Run with coverage
php artisan test --coverage
```

#### Writing Tests
```php
<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_create_product(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'sanctum')
            ->postJson('/api/products', [
                'name' => 'Test Product',
                'code' => 'TEST001',
                'product_price' => 10.00,
            ]);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'data' => [
                    'name' => 'Test Product',
                ]
            ]);
    }
}
```

### Building and Deployment

#### Production Build
```bash
# Install dependencies
composer install --no-dev --optimize-autoloader
npm ci

# Build assets
npm run production
npm run rtl

# Optimize Laravel
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Set permissions
chmod -R 755 storage bootstrap/cache
```

#### Environment Configuration
```env
# Production settings
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-domain.com

# Database
DB_CONNECTION=mysql
DB_HOST=your-db-host
DB_DATABASE=your-db-name
DB_USERNAME=your-db-user
DB_PASSWORD=your-secure-password

# Cache
CACHE_DRIVER=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis

# Mail
MAIL_MAILER=smtp
MAIL_HOST=your-smtp-host
MAIL_PORT=587
MAIL_USERNAME=your-email
MAIL_PASSWORD=your-email-password
```

## 🔧 Troubleshooting

### Common Issues and Solutions

#### Installation Issues

**Issue: Composer install fails with memory errors**
```bash
# Solution: Increase PHP memory limit
php -d memory_limit=2G composer install

# Or set in php.ini
memory_limit = 2G
```

**Issue: NPM install fails**
```bash
# Solution: Clear cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**Issue: Permission denied errors**
```bash
# Solution: Set proper permissions (Linux/Mac)
sudo chown -R $USER:www-data storage bootstrap/cache
sudo chmod -R 775 storage bootstrap/cache

# For Windows (run as administrator)
icacls storage /grant "Everyone:(OI)(CI)F" /T
```

#### Database Issues

**Issue: Migration fails**
```bash
# Solution: Check database connection and run step by step
php artisan migrate:status
php artisan migrate --step
```

**Issue: Foreign key constraint errors**
```bash
# Solution: Run migrations in correct order
php artisan migrate:fresh
php artisan db:seed
```

#### Frontend Build Issues

**Issue: Webpack compilation errors**
```bash
# Solution: Clear cache and rebuild
rm -rf node_modules/.cache
npm run dev
```

**Issue: SCSS compilation errors**
```bash
# Solution: Check SCSS syntax and imports
npm run dev -- --verbose
```

#### Runtime Issues

**Issue: 500 Internal Server Error**
1. Check Laravel logs: `storage/logs/laravel.log`
2. Enable debug mode: `APP_DEBUG=true` in `.env`
3. Check file permissions
4. Clear caches: `php artisan cache:clear`

**Issue: API returns 401 Unauthorized**
1. Check if user is logged in
2. Verify token is being sent in headers
3. Check token expiration: `SANCTUM_TTL` in `.env`

**Issue: Images not displaying**
1. Run: `php artisan storage:link`
2. Check file permissions on storage directory
3. Verify `MEDIA_DISK` setting in `.env`

#### Performance Issues

**Issue: Slow page loading**
1. Enable caching:
   ```bash
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   ```
2. Optimize database queries
3. Use Redis for caching and sessions

**Issue: Large bundle size**
1. Run production build: `npm run production`
2. Enable gzip compression on web server
3. Implement code splitting

### Debug Mode

Enable debug mode for development:

```env
APP_DEBUG=true
APP_ENV=local
```

**Never enable debug mode in production!**

### Logging

Check application logs:
```bash
# View latest logs
tail -f storage/logs/laravel.log

# View specific date logs
cat storage/logs/laravel-2024-01-15.log
```

### Performance Monitoring

Monitor application performance:

1. **Database Queries**: Use Laravel Debugbar in development
2. **Memory Usage**: Monitor PHP memory consumption
3. **Response Times**: Use application performance monitoring tools
4. **Error Rates**: Monitor error logs and rates

### Backup and Recovery

#### Database Backup
```bash
# Create backup
mysqldump -u username -p database_name > backup.sql

# Restore backup
mysql -u username -p database_name < backup.sql
```

#### File Backup
```bash
# Backup storage directory
tar -czf storage_backup.tar.gz storage/

# Backup entire application
tar -czf swiftsale_backup.tar.gz --exclude=node_modules --exclude=vendor .
```

### Getting Help

1. **Check Documentation**: Review this README and Laravel docs
2. **Search Issues**: Look for similar problems in GitHub issues
3. **Community Support**: Join Laravel and React communities
4. **Professional Support**: Consider hiring Laravel/React developers

## 🤝 Contributing

We welcome contributions to SwiftSale! Here's how you can help:

### Types of Contributions

- **Bug Reports**: Report issues you encounter
- **Feature Requests**: Suggest new features
- **Code Contributions**: Submit pull requests
- **Documentation**: Improve documentation
- **Testing**: Help with testing and QA

### Development Process

1. **Fork the Repository**
   ```bash
   git clone https://github.com/your-username/SwiftSale.git
   cd SwiftSale
   ```

2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make Changes**
   - Follow coding standards
   - Add tests for new features
   - Update documentation

4. **Test Your Changes**
   ```bash
   php artisan test
   npm run test
   ```

5. **Commit and Push**
   ```bash
   git add .
   git commit -m "Add: your feature description"
   git push origin feature/your-feature-name
   ```

6. **Create Pull Request**
   - Describe your changes
   - Reference any related issues
   - Include screenshots if applicable

### Coding Guidelines

#### PHP/Laravel
- Follow PSR-12 coding standards
- Use meaningful variable names
- Add proper docblocks
- Write tests for new features

#### JavaScript/React
- Use ESLint configuration
- Follow React best practices
- Use functional components with hooks
- Add PropTypes or TypeScript types

#### Database
- Use descriptive migration names
- Add proper indexes
- Follow naming conventions
- Include rollback methods

### Reporting Issues

When reporting bugs, please include:

1. **Environment Details**:
   - PHP version
   - Laravel version
   - Node.js version
   - Database version
   - Operating system

2. **Steps to Reproduce**:
   - Detailed steps
   - Expected behavior
   - Actual behavior

3. **Error Messages**:
   - Full error messages
   - Stack traces
   - Log entries

4. **Screenshots**: If applicable

### Feature Requests

For feature requests, please provide:

1. **Use Case**: Why is this feature needed?
2. **Description**: Detailed description of the feature
3. **Mockups**: UI mockups if applicable
4. **Implementation Ideas**: Technical suggestions

### Code Review Process

All contributions go through code review:

1. **Automated Checks**: CI/CD pipeline runs tests
2. **Manual Review**: Core team reviews code
3. **Feedback**: Reviewers provide feedback
4. **Approval**: Changes approved and merged

### Recognition

Contributors are recognized in:
- GitHub contributors list
- Release notes
- Documentation credits

## 📄 License

SwiftSale is open-sourced software licensed under the [MIT License](https://opensource.org/licenses/MIT).

### MIT License

```
Copyright (c) 2024 SwiftSale

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

### Third-Party Licenses

This project uses several open-source packages. Please refer to their respective licenses:

- **Laravel**: MIT License
- **React**: MIT License
- **Bootstrap**: MIT License
- **Chart.js**: MIT License
- **Other dependencies**: See `composer.json` and `package.json`

---

## 📞 Support and Contact

### Community Support
- **GitHub Issues**: [Report bugs and request features](https://github.com/your-username/SwiftSale/issues)
- **Discussions**: [Community discussions](https://github.com/your-username/SwiftSale/discussions)
- **Documentation**: This README and inline code documentation

### Professional Support
For commercial support, custom development, or enterprise features:
- **Email**: support@swiftsale.com
- **Website**: https://swiftsale.com
- **Documentation**: https://docs.swiftsale.com

### Stay Updated
- **GitHub**: Star and watch the repository
- **Releases**: Subscribe to release notifications
- **Changelog**: Check `CHANGELOG.md` for updates

---

**Thank you for using SwiftSale! 🚀**

*Built with ❤️ using Laravel and React*
