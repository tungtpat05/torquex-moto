-- =============================================
-- V3: Complete Official KTM Colorway Variants (2+ each) & Gallery Images (6 per model)
-- =============================================

DECLARE @ColWhite INT = (SELECT id FROM color WHERE color_name = 'Factory White');

DECLARE @Prod1390 INT = (SELECT id FROM product WHERE slug = '1390-super-duke-r-evo');
DECLARE @Prod990  INT = (SELECT id FROM product WHERE slug = '990-duke');
DECLARE @Prod390  INT = (SELECT id FROM product WHERE slug = '390-duke');
DECLARE @ProdRc8c INT = (SELECT id FROM product WHERE slug = 'rc-8c');
DECLARE @Prod1290 INT = (SELECT id FROM product WHERE slug = '1290-super-adventure-r');
DECLARE @Prod690  INT = (SELECT id FROM product WHERE slug = '690-smc-r');

-- 1. Assign distinct official studio colorway images to each variant
UPDATE product_variant SET variant_image = '/images/models/1390_black_90_right.png' WHERE sku = 'KTM-1390-SDR-BLK';
UPDATE product_variant SET variant_image = '/images/models/990_duke_black_90_right.png' WHERE sku = 'KTM-990-DUKE-BLK';
UPDATE product_variant SET variant_image = '/images/models/390_duke_blue_90_right.png' WHERE sku = 'KTM-390-DUKE-BLU';
UPDATE product_variant SET variant_image = '/images/models/rc8c_90_right.png' WHERE sku = 'KTM-RC8C-BLK';
UPDATE product_variant SET variant_image = '/images/models/1290_adv_front_right.png' WHERE sku = 'KTM-1290-SAR-WHT';

IF @Prod690 IS NOT NULL AND @ColWhite IS NOT NULL AND NOT EXISTS (SELECT 1 FROM product_variant WHERE sku = 'KTM-690-SMC-WHT')
    INSERT INTO product_variant (product_id, color_id, sku, additional_price, stock_quantity, variant_image, is_active)
    VALUES (@Prod690, @ColWhite, 'KTM-690-SMC-WHT', 300, 4, '/images/models/690_smc_white_90_right.png', 1);

-- 2. Replace duplicate thumbnail entries in product_image with distinct angles
UPDATE product_image SET image_url = '/images/models/990_duke_orange_front_right.png'
WHERE product_id = @Prod990 AND image_url = '/images/models/990_duke_90_right.png';

UPDATE product_image SET image_url = '/images/models/390_duke_orange_front_right.png'
WHERE product_id = @Prod390 AND image_url = '/images/models/390_duke_90_right.png';

UPDATE product_image SET image_url = '/images/models/1290_adv_90_left.png'
WHERE product_id = @Prod1290 AND image_url = '/images/models/1290_adv_90_right.png';

UPDATE product_image SET image_url = '/images/models/690_smc_front_right.jpg'
WHERE product_id = @Prod690 AND image_url = '/images/models/690_smc_90_right.png';

-- 3. Insert additional gallery views so every model has 6 distinct product_image entries
INSERT INTO product_image (product_id, image_url, display_order)
SELECT v.product_id, v.image_url, v.display_order
FROM (
    VALUES
        (@Prod1390, '/images/models/1390_orange_rear_right.png', 5),
        (@Prod1390, '/images/models/1390_black_left.png', 6),
        (@Prod990,  '/images/models/990_duke_orange_90_left.png', 2),
        (@Prod990,  '/images/models/990_duke_orange_rear_left.png', 3),
        (@Prod990,  '/images/models/990_duke_black_front_left.png', 4),
        (@Prod990,  '/images/models/990_duke_headlight.png', 5),
        (@Prod990,  '/images/models/990_duke_action_1.jpg', 6),
        (@Prod390,  '/images/models/390_duke_orange_90_left.png', 2),
        (@Prod390,  '/images/models/390_duke_blue_front_right.png', 3),
        (@Prod390,  '/images/models/390_duke_blue_front_left.png', 4),
        (@Prod390,  '/images/models/390_duke_tft.png', 5),
        (@Prod390,  '/images/models/390_duke_action_1.jpg', 6),
        (@ProdRc8c, '/images/models/rc8c_90_left.png', 3),
        (@ProdRc8c, '/images/models/rc8c_front_left.png', 4),
        (@ProdRc8c, '/images/models/rc8c_rear_right.png', 5),
        (@ProdRc8c, '/images/models/rc8c_dashboard.png', 6),
        (@Prod1290, '/images/models/1290_adv_front_left.png', 2),
        (@Prod1290, '/images/models/1290_adv_rear_left.png', 3),
        (@Prod1290, '/images/models/1290_adv_dashboard.jpg', 4),
        (@Prod1290, '/images/models/1290_adv_suspension.jpg', 5),
        (@Prod1290, '/images/models/1290_adv_action.jpg', 6),
        (@Prod690,  '/images/models/690_smc_90_left.jpg', 2),
        (@Prod690,  '/images/models/690_smc_front_left.jpg', 3),
        (@Prod690,  '/images/models/690_smc_rear_right.jpg', 4),
        (@Prod690,  '/images/models/690_smc_action_1.jpg', 5),
        (@Prod690,  '/images/models/690_smc_action_5.jpg', 6)
) AS v(product_id, image_url, display_order)
WHERE v.product_id IS NOT NULL
  AND NOT EXISTS (
      SELECT 1 FROM product_image existing
      WHERE existing.product_id = v.product_id
        AND existing.image_url = v.image_url
  );
