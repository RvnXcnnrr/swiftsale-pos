<?php

return [

    /*
    |--------------------------------------------------------------------------
    | All Titles and static string in blade files - English Language
    |--------------------------------------------------------------------------
    |
    */
    //menu.blade keys

    'pdf' => [
        'date' => 'Date',
        'number' => 'Number',
        'payment_status' => 'Payment Status',
        'customer_info' => 'Customer Info',
        'name' => 'Name',
        'phone' => 'Phone',
        'address' => 'Address',
        'email' => 'Email',
        'company_info' => 'Company Info',
        'product' => 'Product',
        'unit_price' => 'UNIT PRICE',
        'quantity' => 'QUANTITY',
        'discount' => 'Discount',
        'tax' => 'TAX',
        'total' => 'Total',
        'order_tax' => 'Order Tax',
        'shipping' => 'Shipping',
        'paid_amount' => 'Paid Amount',
        'signature' => 'Signature',
        'status' => 'Status',
        'supplier_info' => 'Supplier Info',
        'unit_cost' => 'UNIT COST',
        'customer' => 'customer',
        'total_sales' => 'Total Sales',
        'total_amount' => 'Total Amount',
        'total_paid' => 'Total Paid',
        'total_sale_due' => 'Total Sale Due',
        'reference' => 'Reference',
        'due_amount' => 'Due Amount',
        'customer_pdf' => 'Customer Pdf',
        'customer_sales_pdf' => 'Customer Sales Pdf',
        'sale_list' => 'Sale List',
        'customer_name' => 'Customer Name',
        'customer_quotations_pdf' => 'Customer Quotations Pdf',
        'quotation_list' => 'Quotation List',
        'customer_returns_pdf' => 'Customer Returns Pdf',
        'return_list' => 'Return List',
        'customer_payments_pdf' => 'Customer Payments Pdf',
        'payment_list' => 'Payment List',
        'received_amount' => 'Received Amount',
        'payment_type' => 'Payment Type',
        'sale_reference' => 'Sale Reference',
        'top_customers_list' => 'Top Customers List',
        'top_customers_pdf' => 'Top Customers Pdf',
        'supplier' => 'Supplier',
        'warehouse' => 'warehouse',
        'amount' => 'Amount',
        'category' => 'Category',
        'code' => 'Code',
        'brand' => 'Brand',
        'price' => 'Price',
        'product_unit' => 'Product unit',
        'in_stock' => 'In stock',
        'created_on' => 'Created on',
        'client' => 'Client',
        'sub_total' => 'Sub Total',
        'paid' => 'Paid',
        'due' => 'Due',
        'cost' => 'Cost',
        'current_stock' => 'Current Stock',
        'product_code' => 'Product Code',
        'product_name' => 'Product Name',
    ],

    'error' => [
        'product_cant_deleted' => 'Product can\'t be deleted',
        'code_taken' => 'The code has already been taken.',
        'default_warehouse_cant_delete' => 'Default warehouse can\'t be deleted.',
        'warehouse_cant_delete' => 'Warehouse can\'t be deleted.',
        'default_user_cant_delete' => 'Default user can\'t be deleted.',
        'this_action_is_not_allowed_for_default_record' => 'This action is not allowed for default record.',
        'invalid_username_password' => 'Invalid email or password.',
        'available_quantity' => 'Quantity must be less than Available quantity.',
        'product_category_can_not_delete' => 'Product category can\'t be deleted.',
    ],

    'success' => [
        'cache_clear_successfully' => 'Cache cleared Successfully',
        'product_category_delete' => 'Product category deleted successfully.',
    ],

    'heading_discount' => 'DISCOUNT',
    'heading_total' => 'TOTAL',
    'sale_pdf' => 'Sale Pdf',
    'purchase_pdf' => 'Purchase PDF',
    'Sale_return_pdf' => 'Sale Return PDF',
    'purchase_return_pdf' => 'Purchase Return PDF',
    'quotation_pdf' => 'Quotation PDF',

    // Auto-save messages
    'autosave' => [
        'notification' => [
            'title' => 'Saved Data Found',
            'message' => 'We found previously saved data for this form. Would you like to restore it?',
        ],
        'button' => [
            'restore' => 'Restore Data',
            'discard' => 'Start Fresh',
        ],
    ],
];
