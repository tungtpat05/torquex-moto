-- =============================================
-- V5: Fix Review Schema & Add Missing Performance Indexes
-- 1. Add product_id column to review table (matching Review.java JPA mapping)
-- 2. Add non-clustered indexes on all foreign keys and search columns
-- =============================================

-- 1. Add product_id column to review table if not exists
IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE name = N'product_id' AND object_id = OBJECT_ID(N'review')
)
BEGIN
    ALTER TABLE review ADD product_id INT NULL;
    
    -- Populate product_id from order_item -> product_variant -> product if existing records exist
    EXEC('
        UPDATE r
        SET r.product_id = pv.product_id
        FROM review r
        INNER JOIN order_item oi ON r.order_item_id = oi.id
        INNER JOIN product_variant pv ON oi.variant_id = pv.id
        WHERE r.product_id IS NULL
    ');

    ALTER TABLE review ADD CONSTRAINT fk_review_product FOREIGN KEY (product_id) REFERENCES product(id);
END;

-- 2. Performance Indexes on Foreign Keys and Query Columns

-- Product
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = N'idx_product_brand_id' AND object_id = OBJECT_ID(N'product'))
    CREATE NONCLUSTERED INDEX idx_product_brand_id ON product (brand_id);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = N'idx_product_category_id' AND object_id = OBJECT_ID(N'product'))
    CREATE NONCLUSTERED INDEX idx_product_category_id ON product (category_id);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = N'idx_product_is_active_featured' AND object_id = OBJECT_ID(N'product'))
    CREATE NONCLUSTERED INDEX idx_product_is_active_featured ON product (is_active, is_featured);

-- Product Variant
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = N'idx_variant_product_id' AND object_id = OBJECT_ID(N'product_variant'))
    CREATE NONCLUSTERED INDEX idx_variant_product_id ON product_variant (product_id);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = N'idx_variant_color_id' AND object_id = OBJECT_ID(N'product_variant'))
    CREATE NONCLUSTERED INDEX idx_variant_color_id ON product_variant (color_id);

-- Product Image
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = N'idx_product_image_product_id' AND object_id = OBJECT_ID(N'product_image'))
    CREATE NONCLUSTERED INDEX idx_product_image_product_id ON product_image (product_id);

-- Product Specification & Definitions
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = N'idx_product_spec_product_id' AND object_id = OBJECT_ID(N'product_specification'))
    CREATE NONCLUSTERED INDEX idx_product_spec_product_id ON product_specification (product_id);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = N'idx_spec_def_category_id' AND object_id = OBJECT_ID(N'spec_definition'))
    CREATE NONCLUSTERED INDEX idx_spec_def_category_id ON spec_definition (category_id);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = N'idx_spec_opt_spec_def_id' AND object_id = OBJECT_ID(N'spec_definition_option'))
    CREATE NONCLUSTERED INDEX idx_spec_opt_spec_def_id ON spec_definition_option (spec_definition_id);

-- Cart & Cart Item
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = N'idx_cart_user_id' AND object_id = OBJECT_ID(N'cart'))
    CREATE NONCLUSTERED INDEX idx_cart_user_id ON cart (user_id);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = N'idx_cart_item_cart_id' AND object_id = OBJECT_ID(N'cart_item'))
    CREATE NONCLUSTERED INDEX idx_cart_item_cart_id ON cart_item (cart_id);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = N'idx_cart_item_variant_id' AND object_id = OBJECT_ID(N'cart_item'))
    CREATE NONCLUSTERED INDEX idx_cart_item_variant_id ON cart_item (variant_id);

-- User Address & Social Accounts
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = N'idx_user_address_user_id' AND object_id = OBJECT_ID(N'user_address'))
    CREATE NONCLUSTERED INDEX idx_user_address_user_id ON user_address (user_id);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = N'idx_social_account_user_id' AND object_id = OBJECT_ID(N'user_social_account'))
    CREATE NONCLUSTERED INDEX idx_social_account_user_id ON user_social_account (user_id);

-- Orders & Order Items
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = N'idx_order_user_id' AND object_id = OBJECT_ID(N'[order]'))
    CREATE NONCLUSTERED INDEX idx_order_user_id ON [order] (user_id);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = N'idx_order_status' AND object_id = OBJECT_ID(N'[order]'))
    CREATE NONCLUSTERED INDEX idx_order_status ON [order] (order_status);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = N'idx_order_item_order_id' AND object_id = OBJECT_ID(N'order_item'))
    CREATE NONCLUSTERED INDEX idx_order_item_order_id ON order_item (order_id);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = N'idx_order_item_variant_id' AND object_id = OBJECT_ID(N'order_item'))
    CREATE NONCLUSTERED INDEX idx_order_item_variant_id ON order_item (variant_id);

-- Shipment & Review
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = N'idx_shipment_order_id' AND object_id = OBJECT_ID(N'shipment'))
    CREATE NONCLUSTERED INDEX idx_shipment_order_id ON shipment (order_id);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = N'idx_review_product_id' AND object_id = OBJECT_ID(N'review'))
    CREATE NONCLUSTERED INDEX idx_review_product_id ON review (product_id);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = N'idx_review_user_id' AND object_id = OBJECT_ID(N'review'))
    CREATE NONCLUSTERED INDEX idx_review_user_id ON review (user_id);
