-- =============================================
-- V2: KTM Mono-Brand Flagship Sample Data
-- Brand: KTM only | Categories: 4 | Models: 6 | Full V4 Structured Specs | 3 Roles + Locked Account
-- =============================================

-- 1. BRAND (Single KTM Flagship Brand)
INSERT INTO brand (brand_name, logo_url, description, is_active)
VALUES ('KTM',
        '/images/common/ktm-logo.png',
        'Austrian READY TO RACE motorcycle manufacturer engineered in Mattighofen, Austria.',
        1);

DECLARE @BrandKtm INT = (SELECT id FROM brand WHERE brand_name = 'KTM');

-- 2. CATEGORIES (4 KTM Segments)
INSERT INTO category (category_name, slug, category_image, description, is_active)
VALUES ('Naked', 'naked', '/images/models/1390_sdr_90_right.png',
        'Hyper-naked and scalpel streetfighters built with exposed Chromoly trellis engineering.', 1),
       ('Supersport', 'supersport', '/images/models/rc_8c_studio.png',
        'Dedicated track-bred aerodynamics and lightweight circuit weapons.', 1),
       ('Adventure', 'adventure', '/images/models/1290_adv_90_right.png',
        'Rally-proven transcontinental machines designed for unforgiving terrain.', 1),
       ('Supermoto', 'supermoto', '/images/models/690_smc_90_right.png',
        'Lightweight single-cylinder corner carvers built for maximum agility.', 1);

DECLARE @CatNaked INT = (SELECT id FROM category WHERE slug = 'naked');
DECLARE @CatSupersport INT = (SELECT id FROM category WHERE slug = 'supersport');
DECLARE @CatAdventure INT = (SELECT id FROM category WHERE slug = 'adventure');
DECLARE @CatSupermoto INT = (SELECT id FROM category WHERE slug = 'supermoto');

-- 3. COLORS
INSERT INTO color (color_name, color_code)
VALUES ('KTM Orange', '#FF6700'),
       ('Phantom Black', '#1A1A1A'),
       ('Factory White', '#F4F4F5'),
       ('Racing Blue', '#003399');

DECLARE @ColOrange INT = (SELECT id FROM color WHERE color_name = 'KTM Orange');
DECLARE @ColBlack INT = (SELECT id FROM color WHERE color_name = 'Phantom Black');
DECLARE @ColWhite INT = (SELECT id FROM color WHERE color_name = 'Factory White');
DECLARE @ColBlue INT = (SELECT id FROM color WHERE color_name = 'Racing Blue');

-- 4. PRODUCTS (6 KTM Flagships)
INSERT INTO product (product_name, slug, brand_id, category_id, summary, description,
                     base_price, discount_price, thumbnail, weight_gram, length_cm, width_cm, height_cm,
                     is_featured, is_active)
VALUES ('KTM 1390 Super Duke R Evo', '1390-super-duke-r-evo', @BrandKtm, @CatNaked,
        'THE BEAST // APEX PREDATOR',
        'Forged in Mattighofen with an enlarged 1,350 cc LC8 V-Twin CamShift powertrain delivering 190 HP and 145 Nm of torque, paired with third-generation WP Apex Semi-Active suspension.',
        21499.00, NULL, '/images/models/1390_sdr_90_right.png', 189000, 210, 83, 112, 1, 1),
       ('KTM 990 Duke', '990-duke', @BrandKtm, @CatNaked,
        'THE SCALPEL // LASER PRECISION',
        'Powered by the compact 947 cc LC8c parallel-twin producing 123 HP and 103 Nm in a razor-sharp 179 kg dry chassis engineered for surgical street and track precision.',
        12500.00, NULL, '/images/models/990_duke_90_right.png', 179000, 207, 81, 110, 0, 1),
       ('KTM 390 Duke', '390-duke', @BrandKtm, @CatNaked,
        'THE CORNER ROCKET // URBAN WEAPON',
        'Next-generation 399 cc LC4c single-cylinder agility with adjustable WP Apex damping, ride-by-wire cornering electronics, and lightweight two-piece steel-trellis geometry.',
        5899.00, NULL, '/images/models/390_duke_90_right.png', 165000, 205, 80, 108, 0, 1),
       ('KTM RC 8C', 'rc-8c', @BrandKtm, @CatSupersport,
        'MOTO2 PROTOTYPE DNA // TRACK-ONLY',
        'Hand-built limited-series circuit weapon combining a hand-welded chrome-molybdenum tubular chassis, carbon-Kevlar MotoGP-inspired bodywork, and an 889 cc 135 HP twin weighing just 142 kg dry.',
        41499.00, NULL, '/images/models/rc_8c_studio.png', 142000, 203, 70, 114, 1, 1),
       ('KTM 1290 Super Adventure R', '1290-super-adventure-r', @BrandKtm, @CatAdventure,
        'THE TRANSCONTINENTAL WEAPON',
        'Built from Dakar Rally dominance with a 1,301 cc 160 HP LC8 V-Twin, rugged 21/18-inch wire-spoked wheels, and long-travel WP XPLOR suspension for extreme expeditions.',
        20299.00, NULL, '/images/models/1290_adv_90_right.png', 221000, 225, 90, 140, 0, 1),
       ('KTM 690 SMC R', '690-smc-r', @BrandKtm, @CatSupermoto,
        'THE SUPERMOTO KING // PURE AGILITY',
        'The benchmark 693 cc LC4 single-cylinder supermoto packing 74 HP and 73.5 Nm into a feathery 147 kg frame with Supermoto ABS and Quickshifter+ for ruthless slide control.',
        12499.00, NULL, '/images/models/690_smc_90_right.png', 147000, 215, 84, 117, 0, 1);

DECLARE @Prod1390 INT = (SELECT id FROM product WHERE slug = '1390-super-duke-r-evo');
DECLARE @Prod990 INT = (SELECT id FROM product WHERE slug = '990-duke');
DECLARE @Prod390 INT = (SELECT id FROM product WHERE slug = '390-duke');
DECLARE @ProdRc8c INT = (SELECT id FROM product WHERE slug = 'rc-8c');
DECLARE @Prod1290 INT = (SELECT id FROM product WHERE slug = '1290-super-adventure-r');
DECLARE @Prod690 INT = (SELECT id FROM product WHERE slug = '690-smc-r');

-- 5. PRODUCT GALLERY IMAGES
INSERT INTO product_image (product_id, image_url, display_order)
VALUES (@Prod1390, '/images/models/1390_orange_front_right.png', 1),
       (@Prod1390, '/images/models/1390_black_studio.png', 2),
       (@Prod1390, '/images/models/1390_sdr_90_left.png', 3),
       (@Prod1390, '/images/models/1390_apex_action.jpg', 4),
       (@Prod990, '/images/models/990_duke_90_right.png', 1),
       (@Prod390, '/images/models/390_duke_90_right.png', 1),
       (@ProdRc8c, '/images/models/rc8c_action_1.jpg', 1),
       (@ProdRc8c, '/images/models/rc8c_action_2.jpg', 2),
       (@Prod1290, '/images/models/1290_adv_90_right.png', 1),
       (@Prod690, '/images/models/690_smc_90_right.png', 1);

-- 6. PRODUCT VARIANTS (SKUs & Real Stock)
INSERT INTO product_variant (product_id, color_id, sku, additional_price, stock_quantity, variant_image, is_active)
VALUES (@Prod1390, @ColOrange, 'KTM-1390-SDR-ORG', 0, 6, '/images/models/1390_sdr_90_right.png', 1),
       (@Prod1390, @ColBlack, 'KTM-1390-SDR-BLK', 400, 4, '/images/models/1390_black_front_right.png', 1),
       (@Prod990, @ColOrange, 'KTM-990-DUKE-ORG', 0, 8, '/images/models/990_duke_90_right.png', 1),
       (@Prod990, @ColBlack, 'KTM-990-DUKE-BLK', 250, 5, '/images/models/990_duke_90_right.png', 1),
       (@Prod390, @ColOrange, 'KTM-390-DUKE-ORG', 0, 12, '/images/models/390_duke_90_right.png', 1),
       (@Prod390, @ColBlue, 'KTM-390-DUKE-BLU', 150, 9, '/images/models/390_duke_90_right.png', 1),
       (@ProdRc8c, @ColOrange, 'KTM-RC8C-ORG', 0, 2, '/images/models/rc_8c_studio.png', 1),
       (@ProdRc8c, @ColBlack, 'KTM-RC8C-BLK', 900, 1, '/images/models/rc8c_action_1.jpg', 1),
       (@Prod1290, @ColOrange, 'KTM-1290-SAR-ORG', 0, 5, '/images/models/1290_adv_90_right.png', 1),
       (@Prod1290, @ColWhite, 'KTM-1290-SAR-WHT', 350, 3, '/images/models/1290_adv_90_right.png', 1),
       (@Prod690, @ColOrange, 'KTM-690-SMC-ORG', 0, 7, '/images/models/690_smc_90_right.png', 1);

-- 7. STRUCTURED SPEC DEFINITIONS (V4) ACROSS ALL 4 CATEGORIES
INSERT INTO spec_definition (category_id, key_code, display_name, data_type, unit, display_order, is_required, is_active)
SELECT c.id, s.key_code, s.display_name, s.data_type, s.unit, s.display_order, s.is_required, 1
FROM category c
CROSS JOIN (
    VALUES ('displacement', 'Displacement', 'number', 'cc', 1, 1),
           ('max_power', 'Max Power', 'number', 'HP', 2, 1),
           ('max_torque', 'Max Torque', 'number', 'Nm', 3, 1),
           ('dry_weight', 'Dry Weight', 'number', 'kg', 4, 1),
           ('transmission', 'Transmission', 'select', NULL, 5, 0),
           ('brakes', 'Braking System', 'text', NULL, 6, 0),
           ('abs', 'ABS System', 'select', NULL, 7, 0),
           ('suspension', 'Suspension', 'text', NULL, 8, 0),
           ('seat_height', 'Seat Height', 'number', 'mm', 9, 0),
           ('fuel_tank', 'Fuel Tank', 'number', 'L', 10, 0)
) AS s(key_code, display_name, data_type, unit, display_order, is_required);

-- Select options for transmission & abs
INSERT INTO spec_definition_option (spec_definition_id, option_value, display_order)
SELECT sd.id, opt.option_value, opt.display_order
FROM spec_definition sd
CROSS JOIN (
    VALUES ('6-speed with Quickshifter+', 1),
           ('6-speed', 2)
) AS opt(option_value, display_order)
WHERE sd.key_code = 'transmission';

INSERT INTO spec_definition_option (spec_definition_id, option_value, display_order)
SELECT sd.id, opt.option_value, opt.display_order
FROM spec_definition sd
CROSS JOIN (
    VALUES ('Bosch Cornering ABS + Supermoto', 1),
           ('Offroad ABS', 2),
           ('Track Setup (No ABS)', 3)
) AS opt(option_value, display_order)
WHERE sd.key_code = 'abs';

-- 8. PRODUCT SPECIFICATIONS VALUES FOR ALL 6 MODELS
-- Numeric & Text specs
INSERT INTO product_specification (product_id, spec_definition_id, value, value_number)
SELECT p.id, sd.id, v.val_text, v.val_num
FROM (
    VALUES
    -- 1390 Super Duke R Evo
    ('1390-super-duke-r-evo', 'displacement', NULL, 1350.00),
    ('1390-super-duke-r-evo', 'max_power', NULL, 190.00),
    ('1390-super-duke-r-evo', 'max_torque', NULL, 145.00),
    ('1390-super-duke-r-evo', 'dry_weight', NULL, 189.00),
    ('1390-super-duke-r-evo', 'brakes', 'Brembo Stylema Monobloc 320 mm Twin Disc', NULL),
    ('1390-super-duke-r-evo', 'suspension', 'WP Apex Semi-Active (SAT Gen 3)', NULL),
    ('1390-super-duke-r-evo', 'seat_height', NULL, 834.00),
    ('1390-super-duke-r-evo', 'fuel_tank', NULL, 17.50),
    -- 990 Duke
    ('990-duke', 'displacement', NULL, 947.00),
    ('990-duke', 'max_power', NULL, 123.00),
    ('990-duke', 'max_torque', NULL, 103.00),
    ('990-duke', 'dry_weight', NULL, 179.00),
    ('990-duke', 'brakes', 'Dual 300 mm Disc with 4-Piston Radial Calipers', NULL),
    ('990-duke', 'suspension', 'WP Apex 43 mm USD Fork / Monoshock', NULL),
    ('990-duke', 'seat_height', NULL, 825.00),
    ('990-duke', 'fuel_tank', NULL, 14.80),
    -- 390 Duke
    ('390-duke', 'displacement', NULL, 399.00),
    ('390-duke', 'max_power', NULL, 45.00),
    ('390-duke', 'max_torque', NULL, 39.00),
    ('390-duke', 'dry_weight', NULL, 165.00),
    ('390-duke', 'brakes', 'ByBre 320 mm 4-Piston Radial Caliper', NULL),
    ('390-duke', 'suspension', 'WP Apex Open Cartridge 43 mm (Rebound/Comp Adj.)', NULL),
    ('390-duke', 'seat_height', NULL, 820.00),
    ('390-duke', 'fuel_tank', NULL, 15.00),
    -- RC 8C
    ('rc-8c', 'displacement', NULL, 889.00),
    ('rc-8c', 'max_power', NULL, 135.00),
    ('rc-8c', 'max_torque', NULL, 98.00),
    ('rc-8c', 'dry_weight', NULL, 142.00),
    ('rc-8c', 'brakes', 'Brembo Stylema Radial + RCS19 Corsa Corta', NULL),
    ('rc-8c', 'suspension', 'WP Apex Pro 7543 Fork / 7746 Shock', NULL),
    ('rc-8c', 'seat_height', NULL, 820.00),
    ('rc-8c', 'fuel_tank', NULL, 16.00),
    -- 1290 Super Adventure R
    ('1290-super-adventure-r', 'displacement', NULL, 1301.00),
    ('1290-super-adventure-r', 'max_power', NULL, 160.00),
    ('1290-super-adventure-r', 'max_torque', NULL, 138.00),
    ('1290-super-adventure-r', 'dry_weight', NULL, 221.00),
    ('1290-super-adventure-r', 'brakes', 'Brembo Dual 320 mm Front / 267 mm Rear', NULL),
    ('1290-super-adventure-r', 'suspension', 'WP XPLOR 48 mm USD / PDS Monoshock (220 mm Travel)', NULL),
    ('1290-super-adventure-r', 'seat_height', NULL, 880.00),
    ('1290-super-adventure-r', 'fuel_tank', NULL, 23.00),
    -- 690 SMC R
    ('690-smc-r', 'displacement', NULL, 693.00),
    ('690-smc-r', 'max_power', NULL, 74.00),
    ('690-smc-r', 'max_torque', NULL, 73.50),
    ('690-smc-r', 'dry_weight', NULL, 147.00),
    ('690-smc-r', 'brakes', 'Brembo M4.32 Radial 320 mm Floating Disc', NULL),
    ('690-smc-r', 'suspension', 'WP Apex 48 mm Fully Adjustable (215 mm Travel)', NULL),
    ('690-smc-r', 'seat_height', NULL, 892.00),
    ('690-smc-r', 'fuel_tank', NULL, 13.50)
) AS v(slug, key_code, val_text, val_num)
JOIN product p ON p.slug = v.slug
JOIN spec_definition sd ON sd.category_id = p.category_id AND sd.key_code = v.key_code;

-- Select-option specs
INSERT INTO product_specification (product_id, spec_definition_id, option_id)
SELECT p.id, sd.id, opt.id
FROM (
    VALUES
    ('1390-super-duke-r-evo', 'transmission', '6-speed with Quickshifter+'),
    ('1390-super-duke-r-evo', 'abs', 'Bosch Cornering ABS + Supermoto'),
    ('990-duke', 'transmission', '6-speed with Quickshifter+'),
    ('990-duke', 'abs', 'Bosch Cornering ABS + Supermoto'),
    ('390-duke', 'transmission', '6-speed with Quickshifter+'),
    ('390-duke', 'abs', 'Bosch Cornering ABS + Supermoto'),
    ('rc-8c', 'transmission', '6-speed with Quickshifter+'),
    ('rc-8c', 'abs', 'Track Setup (No ABS)'),
    ('1290-super-adventure-r', 'transmission', '6-speed with Quickshifter+'),
    ('1290-super-adventure-r', 'abs', 'Offroad ABS'),
    ('690-smc-r', 'transmission', '6-speed with Quickshifter+'),
    ('690-smc-r', 'abs', 'Bosch Cornering ABS + Supermoto')
) AS s(slug, key_code, opt_val)
JOIN product p ON p.slug = s.slug
JOIN spec_definition sd ON sd.category_id = p.category_id AND sd.key_code = s.key_code
JOIN spec_definition_option opt ON opt.spec_definition_id = sd.id AND opt.option_value = s.opt_val;

-- 9. SEED USERS (Password for all test accounts: 123456)
INSERT INTO [user] (email, password_hash, full_name, role, is_active)
VALUES ('admin@torquex.com', '$2a$12$v4ESVCbsDL8h.1MfZ51b4ewxXs.RWDluoqhnI8kN.LlSHssmEtNjG', 'TorqueX System Admin', 'ADMIN', 1),
       ('staff@torquex.com', '$2a$12$v4ESVCbsDL8h.1MfZ51b4ewxXs.RWDluoqhnI8kN.LlSHssmEtNjG', 'TorqueX Store Staff', 'STAFF', 1),
       ('customer@torquex.com', '$2a$12$v4ESVCbsDL8h.1MfZ51b4ewxXs.RWDluoqhnI8kN.LlSHssmEtNjG', 'TorqueX KTM Rider', 'CUSTOMER', 1),
       ('locked@torquex.com', '$2a$12$v4ESVCbsDL8h.1MfZ51b4ewxXs.RWDluoqhnI8kN.LlSHssmEtNjG', 'Suspended Rider', 'CUSTOMER', 0);
