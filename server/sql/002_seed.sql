-- ShopStreet Seed Data (002_seed.sql)

-- 1. Categories
INSERT INTO categories (id, name, slug) VALUES
('a0000000-0000-0000-0000-000000000001', 'Electronics', 'electronics'),
('a0000000-0000-0000-0000-000000000002', 'Clothing & Fashion', 'clothing-fashion'),
('a0000000-0000-0000-0000-000000000003', 'Footwear', 'footwear'),
('a0000000-0000-0000-0000-000000000004', 'Home & Kitchen', 'home-kitchen'),
('a0000000-0000-0000-0000-000000000005', 'Books & Stationery', 'books-stationery')
ON CONFLICT (slug) DO NOTHING;

-- 2. Users (Password for both: Password123!)
-- Valid bcrypt hash for "Password123!":
INSERT INTO users (id, name, email, password_hash, role) VALUES
('b0000000-0000-0000-0000-000000000001', 'Admin User', 'admin@shopstreet.com', '$2a$10$hp0hRedGeLmh2QQwBF4KfuX5VDZvqMeg7v7QWrFzxPo3NRHyFaR0e', 'ADMIN'),
('b0000000-0000-0000-0000-000000000002', 'Aditya Sharma', 'aditya@example.com', '$2a$10$hp0hRedGeLmh2QQwBF4KfuX5VDZvqMeg7v7QWrFzxPo3NRHyFaR0e', 'CUSTOMER')
ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash;

-- 3. Products
INSERT INTO products (id, category_id, title, description, price, stock, image_url, is_active) VALUES
-- Electronics
('c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Sony WH-1000XM5 Wireless Headphones', 'Industry-leading noise canceling with two processors and 8 microphones for unprecedented noise canceling.', 398.00, 25, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80', true),
('c0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'Apple MacBook Air M2 13-inch', 'Strikingly thin design with fast M2 chip, 13.6-inch Liquid Retina display, and 18 hours battery life.', 1099.00, 15, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80', true),
('c0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'Logitech MX Master 3S Mouse', 'Quiet clicks, 8K DPI any-surface tracking, and MagSpeed electromagnetic scrolling.', 99.99, 40, 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80', true),
('c0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'Keychron K2 Mechanical Keyboard', 'Wireless Bluetooth/USB mechanical keyboard with hot-swappable Gateron G Pro switches.', 89.00, 30, 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80', true),
('c0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000001', 'Dell UltraSharp 27 4K Monitor', 'Brilliant color coverage and clarity with 4K UHD resolution and USB-C connectivity.', 549.99, 10, 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80', true),
('c0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000001', 'Anker 737 Power Bank 24000mAh', 'Ultra-powerful 140W fast portable charger with digital smart display.', 149.99, 50, 'https://images.unsplash.com/photo-1609592424109-dd9892f1b177?w=600&auto=format&fit=crop&q=80', true),

-- Clothing & Fashion
('c0000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000002', 'Classic Denim Jacket', 'Timeless trucker jacket crafted with 100% premium heavyweight denim.', 89.50, 35, 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&auto=format&fit=crop&q=80', true),
('c0000000-0000-0000-0000-000000000008', 'a0000000-0000-0000-0000-000000000002', 'Merino Wool Crewneck Sweater', 'Ultra-soft extrafine merino wool offering breathable natural warmth.', 110.00, 20, 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&auto=format&fit=crop&q=80', true),
('c0000000-0000-0000-0000-000000000009', 'a0000000-0000-0000-0000-000000000002', 'Organic Cotton Oversized Tee', 'Heavyweight 240 GSM organic combed cotton with relaxed dropped shoulders.', 34.00, 75, 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80', true),
('c0000000-0000-0000-0000-000000000010', 'a0000000-0000-0000-0000-000000000002', 'Tailored Linen Trousers', 'Breathable European linen blend tailored for comfort and warm-weather styling.', 78.00, 25, 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&auto=format&fit=crop&q=80', true),
('c0000000-0000-0000-0000-000000000011', 'a0000000-0000-0000-0000-000000000002', 'Waterproof Trench Coat', 'Double-breasted storm-resistant trench coat with belted waist and storm flap.', 185.00, 12, 'https://images.unsplash.com/photo-1544441893-675973e31985?w=600&auto=format&fit=crop&q=80', true),
('c0000000-0000-0000-0000-000000000012', 'a0000000-0000-0000-0000-000000000002', 'Everyday Fleece Hoodie', 'Plush brushed fleece hoodie with kangaroo pocket and double-layer hood.', 59.00, 60, 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&auto=format&fit=crop&q=80', true),

-- Footwear
('c0000000-0000-0000-0000-000000000013', 'a0000000-0000-0000-0000-000000000003', 'Nike Air Max 90 Sneakers', 'Heritage running icon with visible Max Air cushioning and durable rubber waffle outsole.', 130.00, 30, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80', true),
('c0000000-0000-0000-0000-000000000014', 'a0000000-0000-0000-0000-000000000003', 'Chelsea Leather Boots', 'Handcrafted Goodyear welted full-grain leather boots with elastic side panels.', 195.00, 18, 'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=600&auto=format&fit=crop&q=80', true),
('c0000000-0000-0000-0000-000000000015', 'a0000000-0000-0000-0000-000000000003', 'New Balance 574 Core', 'Classic hybrid road/trail runner with ENCAP midsole cushioning.', 89.99, 45, 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&auto=format&fit=crop&q=80', true),
('c0000000-0000-0000-0000-000000000016', 'a0000000-0000-0000-0000-000000000003', 'Minimalist White Leather Low-Tops', 'Italian full-grain calfskin leather sneaker with Margom rubber soles.', 140.00, 22, 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&auto=format&fit=crop&q=80', true),
('c0000000-0000-0000-0000-000000000017', 'a0000000-0000-0000-0000-000000000003', 'Trail Running Waterproof Shoes', 'GORE-TEX weather protection with Contagrip traction for all terrains.', 160.00, 15, 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&auto=format&fit=crop&q=80', true),

-- Home & Kitchen
('c0000000-0000-0000-0000-000000000018', 'a0000000-0000-0000-0000-000000000004', 'Fellow Stagg EKG Electric Kettle', 'Pour-over electric kettle with variable temperature control and precision spout.', 165.00, 20, 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80', true),
('c0000000-0000-0000-0000-000000000019', 'a0000000-0000-0000-0000-000000000004', 'Le Creuset Enameled Cast Iron Dutch Oven', 'Signature 5.5 qt round Dutch oven for exceptional heat distribution and retention.', 420.00, 8, 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&auto=format&fit=crop&q=80', true),
('c0000000-0000-0000-0000-000000000020', 'a0000000-0000-0000-0000-000000000004', 'Baratza Encore Conical Burr Grinder', '40 grind settings from fine for espresso to coarse for French press.', 149.00, 28, 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=600&auto=format&fit=crop&q=80', true),
('c0000000-0000-0000-0000-000000000021', 'a0000000-0000-0000-0000-000000000004', 'Lodge 10.25 Inch Cast Iron Skillet', 'Pre-seasoned heirloom quality cast iron pan for searing, baking, and frying.', 29.90, 60, 'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=600&auto=format&fit=crop&q=80', true),
('c0000000-0000-0000-0000-000000000022', 'a0000000-0000-0000-0000-000000000004', 'AeroPress Coffee Maker XL', 'Patented 3-in-1 brew technology creates rich, smooth grit-free coffee in 1 minute.', 79.95, 45, 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80', true),
('c0000000-0000-0000-0000-000000000023', 'a0000000-0000-0000-0000-000000000004', 'Ceramic Handcrafted Dinnerware Set', '16-piece stoneware dinner set with matte reactive glaze finish.', 120.00, 14, 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=600&auto=format&fit=crop&q=80', true),

-- Books & Stationery
('c0000000-0000-0000-0000-000000000024', 'a0000000-0000-0000-0000-000000000005', 'Designing Data-Intensive Applications', 'The definitive guide to architecture and principles behind modern reliable distributed systems.', 45.00, 35, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80', true),
('c0000000-0000-0000-0000-000000000025', 'a0000000-0000-0000-0000-000000000005', 'Clean Code by Robert C. Martin', 'A handbook of agile software craftsmanship and best engineering practices.', 39.50, 40, 'https://images.unsplash.com/photo-1532012164546-f432f2e37b73?w=600&auto=format&fit=crop&q=80', true),
('c0000000-0000-0000-0000-000000000026', 'a0000000-0000-0000-0000-000000000005', 'Lamy 2000 Fountain Pen', 'Iconic Bauhaus design fountain pen with 14K gold platinum-plated nib.', 199.00, 15, 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=600&auto=format&fit=crop&q=80', true),
('c0000000-0000-0000-0000-000000000027', 'a0000000-0000-0000-0000-000000000005', 'Rhodia Webnotebook A5 Dot Grid', 'French premium 90g ivory vellum paper perfect for fountain pens and note-taking.', 24.50, 50, 'https://images.unsplash.com/photo-1544716278-e513176f20b5?w=600&auto=format&fit=crop&q=80', true),
('c0000000-0000-0000-0000-000000000028', 'a0000000-0000-0000-0000-000000000005', 'Refactoring by Martin Fowler', 'Improving the design of existing code with catalog of proven refactorings.', 48.00, 20, 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80', true),
('c0000000-0000-0000-0000-000000000029', 'a0000000-0000-0000-0000-000000000005', 'Rotring 800 Retractable Mechanical Pencil', 'Full-metal brass body mechanical pencil with twist-and-click retractable mechanism.', 52.00, 30, 'https://images.unsplash.com/photo-1585336261026-62142e0cb9fc?w=600&auto=format&fit=crop&q=80', true)
ON CONFLICT (id) DO NOTHING;

-- 4. Initial Reviews
INSERT INTO reviews (user_id, product_id, rating, comment) VALUES
('b0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000001', 5, 'Best headphones I have ever used. The ANC is unbelievable in noisy coffee shops!'),
('b0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000003', 5, 'The ergonomics and scroll wheel make working on code all day a breeze.'),
('b0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000024', 5, 'Every software engineer must read this book. Clear explanations of storage engines and consensus.')
ON CONFLICT (user_id, product_id) DO NOTHING;
