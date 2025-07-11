<?php

namespace Database\Seeders;

use App\Models\Brand;
use App\Models\Customer;
use App\Models\MainProduct;
use App\Models\Product;
use App\Models\ProductCategory;
use App\Models\Unit;
use App\Models\ManageStock;
use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\Supplier;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class SampleDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create additional customers
        $customers = [
            [
                'name' => 'John Smith',
                'email' => 'john.smith@example.com',
                'phone' => '1234567890',
                'country' => 'USA',
                'city' => 'New York',
                'address' => '123 Main Street, New York, NY 10001',
                'dob' => '1985-06-15',
            ],
            [
                'name' => 'Sarah Johnson',
                'email' => 'sarah.johnson@example.com',
                'phone' => '9876543210',
                'country' => 'Canada',
                'city' => 'Toronto',
                'address' => '456 Queen Street, Toronto, ON M5V 2A8',
                'dob' => '1990-03-22',
            ],
            [
                'name' => 'Michael Brown',
                'email' => 'michael.brown@example.com',
                'phone' => '5555551234',
                'country' => 'UK',
                'city' => 'London',
                'address' => '789 Oxford Street, London W1C 1JN',
                'dob' => '1988-11-08',
            ],
            [
                'name' => 'Emily Davis',
                'email' => 'emily.davis@example.com',
                'phone' => '7777778888',
                'country' => 'Australia',
                'city' => 'Sydney',
                'address' => '321 George Street, Sydney NSW 2000',
                'dob' => '1992-09-14',
            ],
        ];

        foreach ($customers as $customer) {
            Customer::firstOrCreate(['email' => $customer['email']], $customer);
        }

        // Create suppliers (only if they don't exist)
        $suppliers = [
            [
                'name' => 'Tech Supplies Inc.',
                'email' => 'contact@techsupplies.com',
                'phone' => '1111111111',
                'country' => 'USA',
                'city' => 'San Francisco',
                'address' => '100 Tech Avenue, San Francisco, CA 94105',
            ],
            [
                'name' => 'Global Electronics Ltd.',
                'email' => 'sales@globalelectronics.com',
                'phone' => '2222222222',
                'country' => 'China',
                'city' => 'Shenzhen',
                'address' => '200 Electronics Plaza, Shenzhen, China',
            ],
            [
                'name' => 'Fashion Forward Co.',
                'email' => 'orders@fashionforward.com',
                'phone' => '3333333333',
                'country' => 'Italy',
                'city' => 'Milan',
                'address' => '300 Fashion Street, Milan, Italy',
            ],
        ];

        foreach ($suppliers as $supplier) {
            Supplier::firstOrCreate(['email' => $supplier['email']], $supplier);
        }

        // Create brands (only if they don't exist)
        $brands = [
            ['name' => 'Apple', 'description' => 'Premium technology products'],
            ['name' => 'Samsung', 'description' => 'Innovative electronics and appliances'],
            ['name' => 'Nike', 'description' => 'Athletic footwear and apparel'],
            ['name' => 'Sony', 'description' => 'Entertainment and electronics'],
            ['name' => 'Dell', 'description' => 'Computer hardware and technology'],
            ['name' => 'Canon', 'description' => 'Imaging and optical products'],
            ['name' => 'Adidas', 'description' => 'Sports clothing and accessories'],
            ['name' => 'HP', 'description' => 'Computing and printing solutions'],
        ];

        foreach ($brands as $brand) {
            Brand::firstOrCreate(['name' => $brand['name']], $brand);
        }

        // Create product categories (only if they don't exist)
        $categories = [
            ['name' => 'Electronics'],
            ['name' => 'Computers & Laptops'],
            ['name' => 'Mobile Phones'],
            ['name' => 'Clothing & Apparel'],
            ['name' => 'Sports & Fitness'],
            ['name' => 'Home & Garden'],
            ['name' => 'Books & Media'],
            ['name' => 'Health & Beauty'],
        ];

        foreach ($categories as $category) {
            ProductCategory::firstOrCreate($category);
        }

        // Units already exist, so we'll skip creating them

        // Create main products (only if they don't exist)
        $mainProducts = [
            ['name' => 'iPhone 15', 'code' => 'IP15', 'product_unit' => '1', 'product_type' => 1],
            ['name' => 'MacBook Pro', 'code' => 'MBP', 'product_unit' => '1', 'product_type' => 1],
            ['name' => 'Samsung Galaxy S24', 'code' => 'SGS24', 'product_unit' => '1', 'product_type' => 1],
            ['name' => 'Dell XPS 13', 'code' => 'DX13', 'product_unit' => '1', 'product_type' => 1],
            ['name' => 'Nike Air Max', 'code' => 'NAM', 'product_unit' => '1', 'product_type' => 1],
            ['name' => 'Sony WH-1000XM5', 'code' => 'SWH5', 'product_unit' => '1', 'product_type' => 1],
        ];

        foreach ($mainProducts as $mainProduct) {
            MainProduct::firstOrCreate(['code' => $mainProduct['code']], $mainProduct);
        }

        // Get brand and category IDs
        $appleBrand = Brand::where('name', 'Apple')->first();
        $samsungBrand = Brand::where('name', 'Samsung')->first();
        $nikeBrand = Brand::where('name', 'Nike')->first();
        $sonyBrand = Brand::where('name', 'Sony')->first();
        $dellBrand = Brand::where('name', 'Dell')->first();

        $electronicsCategory = ProductCategory::where('name', 'Electronics')->first();
        $computersCategory = ProductCategory::where('name', 'Computers & Laptops')->first();
        $mobilePhonesCategory = ProductCategory::where('name', 'Mobile Phones')->first();
        $sportsCategory = ProductCategory::where('name', 'Sports & Fitness')->first();

        // Get main product IDs
        $iphone15MainProduct = MainProduct::where('code', 'IP15')->first();
        $macbookMainProduct = MainProduct::where('code', 'MBP')->first();
        $samsungMainProduct = MainProduct::where('code', 'SGS24')->first();
        $dellMainProduct = MainProduct::where('code', 'DX13')->first();
        $nikeMainProduct = MainProduct::where('code', 'NAM')->first();
        $sonyMainProduct = MainProduct::where('code', 'SWH5')->first();

        // Create products (only if they don't exist)
        $products = [
            [
                'name' => 'iPhone 15 Pro 128GB',
                'code' => 'IP15P128',
                'product_code' => 'IP15P128',
                'product_category_id' => $mobilePhonesCategory->id,
                'brand_id' => $appleBrand->id,
                'main_product_id' => $iphone15MainProduct->id,
                'product_cost' => 900.00,
                'product_price' => 1199.00,
                'product_unit' => '1', // Piece
                'sale_unit' => '1',
                'purchase_unit' => '1',
                'stock_alert' => '5',
                'quantity_limit' => '100',
                'order_tax' => 10.00,
                'tax_type' => '1',
                'notes' => 'Latest iPhone model with advanced features',
                'barcode_symbol' => 1,
            ],
            [
                'name' => 'MacBook Pro 14" M3',
                'code' => 'MBP14M3',
                'product_code' => 'MBP14M3',
                'product_category_id' => $computersCategory->id,
                'brand_id' => $appleBrand->id,
                'main_product_id' => $macbookMainProduct->id,
                'product_cost' => 1800.00,
                'product_price' => 2399.00,
                'product_unit' => '1',
                'sale_unit' => '1',
                'purchase_unit' => '1',
                'stock_alert' => '3',
                'quantity_limit' => '50',
                'order_tax' => 15.00,
                'tax_type' => '1',
                'notes' => 'Professional laptop with M3 chip',
                'barcode_symbol' => 1,
            ],
            [
                'name' => 'Samsung Galaxy S24 Ultra',
                'code' => 'SGS24U',
                'product_code' => 'SGS24U',
                'product_category_id' => $mobilePhonesCategory->id,
                'brand_id' => $samsungBrand->id,
                'main_product_id' => $samsungMainProduct->id,
                'product_cost' => 1000.00,
                'product_price' => 1299.00,
                'product_unit' => '1',
                'sale_unit' => '1',
                'purchase_unit' => '1',
                'stock_alert' => '5',
                'quantity_limit' => '80',
                'order_tax' => 12.00,
                'tax_type' => '1',
                'notes' => 'Premium Android smartphone',
                'barcode_symbol' => 1,
            ],
            [
                'name' => 'Dell XPS 13 Plus',
                'code' => 'DX13P',
                'product_code' => 'DX13P',
                'product_category_id' => $computersCategory->id,
                'brand_id' => $dellBrand->id,
                'main_product_id' => $dellMainProduct->id,
                'product_cost' => 1200.00,
                'product_price' => 1599.00,
                'product_unit' => '1',
                'sale_unit' => '1',
                'purchase_unit' => '1',
                'stock_alert' => '4',
                'quantity_limit' => '60',
                'order_tax' => 10.00,
                'tax_type' => '1',
                'notes' => 'Ultra-portable business laptop',
                'barcode_symbol' => 1,
            ],
            [
                'name' => 'Nike Air Max 270',
                'code' => 'NAM270',
                'product_code' => 'NAM270',
                'product_category_id' => $sportsCategory->id,
                'brand_id' => $nikeBrand->id,
                'main_product_id' => $nikeMainProduct->id,
                'product_cost' => 80.00,
                'product_price' => 150.00,
                'product_unit' => '1',
                'sale_unit' => '1',
                'purchase_unit' => '1',
                'stock_alert' => '10',
                'quantity_limit' => '200',
                'order_tax' => 8.00,
                'tax_type' => '1',
                'notes' => 'Comfortable running shoes',
                'barcode_symbol' => 1,
            ],
            [
                'name' => 'Sony WH-1000XM5 Headphones',
                'code' => 'SWH1000XM5',
                'product_code' => 'SWH1000XM5',
                'product_category_id' => $electronicsCategory->id,
                'brand_id' => $sonyBrand->id,
                'main_product_id' => $sonyMainProduct->id,
                'product_cost' => 250.00,
                'product_price' => 399.00,
                'product_unit' => '1',
                'sale_unit' => '1',
                'purchase_unit' => '1',
                'stock_alert' => '8',
                'quantity_limit' => '100',
                'order_tax' => 10.00,
                'tax_type' => '1',
                'notes' => 'Premium noise-canceling headphones',
                'barcode_symbol' => 1,
            ],
        ];

        foreach ($products as $product) {
            Product::firstOrCreate(['code' => $product['code']], $product);
        }

        // Get created product IDs for stock creation
        $iphone15Product = Product::where('code', 'IP15P128')->first();
        $macbookProduct = Product::where('code', 'MBP14M3')->first();
        $samsungProduct = Product::where('code', 'SGS24U')->first();
        $dellProduct = Product::where('code', 'DX13P')->first();
        $nikeProduct = Product::where('code', 'NAM270')->first();
        $sonyProduct = Product::where('code', 'SWH1000XM5')->first();

        // Create stock for products (only if products exist)
        if ($iphone15Product) {
            ManageStock::firstOrCreate(['product_id' => $iphone15Product->id, 'warehouse_id' => 1], ['quantity' => 25]);
        }
        if ($macbookProduct) {
            ManageStock::firstOrCreate(['product_id' => $macbookProduct->id, 'warehouse_id' => 1], ['quantity' => 15]);
        }
        if ($samsungProduct) {
            ManageStock::firstOrCreate(['product_id' => $samsungProduct->id, 'warehouse_id' => 1], ['quantity' => 30]);
        }
        if ($dellProduct) {
            ManageStock::firstOrCreate(['product_id' => $dellProduct->id, 'warehouse_id' => 1], ['quantity' => 20]);
        }
        if ($nikeProduct) {
            ManageStock::firstOrCreate(['product_id' => $nikeProduct->id, 'warehouse_id' => 1], ['quantity' => 50]);
        }
        if ($sonyProduct) {
            ManageStock::firstOrCreate(['product_id' => $sonyProduct->id, 'warehouse_id' => 1], ['quantity' => 35]);
        }

        // Get customer IDs for sales
        $johnSmith = Customer::where('email', 'john.smith@example.com')->first();
        $sarahJohnson = Customer::where('email', 'sarah.johnson@example.com')->first();
        $michaelBrown = Customer::where('email', 'michael.brown@example.com')->first();

        // Create sample sales (only if customers exist)
        $sales = [];
        if ($johnSmith) {
            $sales[] = [
                'date' => Carbon::now()->subDays(5)->format('Y-m-d'),
                'customer_id' => $johnSmith->id,
                'warehouse_id' => 1,
                'tax_rate' => 10.00,
                'tax_amount' => 119.90,
                'discount' => 50.00,
                'shipping' => 15.00,
                'grand_total' => 1283.90,
                'received_amount' => 1283.90,
                'paid_amount' => 1283.90,
                'payment_type' => 1,
                'note' => 'Customer purchase - iPhone 15 Pro',
                'reference_code' => 'SA-001',
                'status' => 1,
                'payment_status' => 1,
            ];
        }

        if ($sarahJohnson) {
            $sales[] = [
                'date' => Carbon::now()->subDays(3)->format('Y-m-d'),
                'customer_id' => $sarahJohnson->id,
                'warehouse_id' => 1,
                'tax_rate' => 8.00,
                'tax_amount' => 12.00,
                'discount' => 0.00,
                'shipping' => 10.00,
                'grand_total' => 172.00,
                'received_amount' => 172.00,
                'paid_amount' => 172.00,
                'payment_type' => 2,
                'note' => 'Customer purchase - Nike Air Max',
                'reference_code' => 'SA-002',
                'status' => 1,
                'payment_status' => 1,
            ];
        }

        if ($michaelBrown) {
            $sales[] = [
                'date' => Carbon::now()->subDays(1)->format('Y-m-d'),
                'customer_id' => $michaelBrown->id,
                'warehouse_id' => 1,
                'tax_rate' => 10.00,
                'tax_amount' => 39.90,
                'discount' => 20.00,
                'shipping' => 25.00,
                'grand_total' => 443.90,
                'received_amount' => 443.90,
                'paid_amount' => 443.90,
                'payment_type' => 1,
                'note' => 'Customer purchase - Sony Headphones',
                'reference_code' => 'SA-003',
                'status' => 1,
                'payment_status' => 1,
            ];
        }

        foreach ($sales as $sale) {
            Sale::firstOrCreate(['reference_code' => $sale['reference_code']], $sale);
        }

        // Create sale items (only if sales and products exist)
        $sale1 = Sale::where('reference_code', 'SA-001')->first();
        $sale2 = Sale::where('reference_code', 'SA-002')->first();
        $sale3 = Sale::where('reference_code', 'SA-003')->first();

        if ($sale1 && $iphone15Product) {
            SaleItem::firstOrCreate([
                'sale_id' => $sale1->id,
                'product_id' => $iphone15Product->id,
            ], [
                'product_price' => 1199.00,
                'net_unit_price' => 1199.00,
                'tax_type' => 1,
                'tax_value' => 10.00,
                'tax_amount' => 119.90,
                'discount_type' => 1,
                'discount_value' => 50.00,
                'discount_amount' => 50.00,
                'sale_unit' => 1,
                'quantity' => 1,
                'sub_total' => 1199.00,
            ]);
        }

        if ($sale2 && $nikeProduct) {
            SaleItem::firstOrCreate([
                'sale_id' => $sale2->id,
                'product_id' => $nikeProduct->id,
            ], [
                'product_price' => 150.00,
                'net_unit_price' => 150.00,
                'tax_type' => 1,
                'tax_value' => 8.00,
                'tax_amount' => 12.00,
                'discount_type' => 1,
                'discount_value' => 0.00,
                'discount_amount' => 0.00,
                'sale_unit' => 1,
                'quantity' => 1,
                'sub_total' => 150.00,
            ]);
        }

        if ($sale3 && $sonyProduct) {
            SaleItem::firstOrCreate([
                'sale_id' => $sale3->id,
                'product_id' => $sonyProduct->id,
            ], [
                'product_price' => 399.00,
                'net_unit_price' => 399.00,
                'tax_type' => 1,
                'tax_value' => 10.00,
                'tax_amount' => 39.90,
                'discount_type' => 1,
                'discount_value' => 20.00,
                'discount_amount' => 20.00,
                'sale_unit' => 1,
                'quantity' => 1,
                'sub_total' => 399.00,
            ]);
        }
    }
}
