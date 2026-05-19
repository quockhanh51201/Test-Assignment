-- Enable uuid-ossp extension if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Seed Features
INSERT INTO "features" ("id", "code", "name", "description") VALUES
('f1a7b001-c81b-4d43-a61f-d227c244b752', 'generate_image', 'AI Image Generator', 'Tạo ảnh bằng AI'),
('f1a7b002-c81b-4d43-a61f-d227c244b752', 'auto_post', 'Auto Social Post', 'Tự động đăng bài mạng xã hội'),
('f1a7b003-c81b-4d43-a61f-d227c244b752', 'premium_templates', 'Premium Templates', 'Mẫu thiết kế cao cấp')
ON CONFLICT ("code") DO UPDATE SET
  "name" = EXCLUDED."name",
  "description" = EXCLUDED."description";

-- Seed Packages
INSERT INTO "packages" ("id", "name", "description", "price", "credits") VALUES
('b1a7b001-c81b-4d43-a61f-d227c244b752', 'Gói Cơ Bản (Basic)', 'Dành cho người mới bắt đầu', 50000.00, 100),
('b1a7b002-c81b-4d43-a61f-d227c244b752', 'Gói Chuyên Nghiệp (Pro)', 'Đầy đủ tính năng cao cấp', 200000.00, 500)
ON CONFLICT ("id") DO UPDATE SET
  "name" = EXCLUDED."name",
  "description" = EXCLUDED."description",
  "price" = EXCLUDED."price",
  "credits" = EXCLUDED."credits";

-- Clean up and Seed Package Features
DELETE FROM "package_features" WHERE "package_id" IN ('b1a7b001-c81b-4d43-a61f-d227c244b752', 'b1a7b002-c81b-4d43-a61f-d227c244b752');

INSERT INTO "package_features" ("package_id", "feature_id") VALUES
('b1a7b001-c81b-4d43-a61f-d227c244b752', 'f1a7b001-c81b-4d43-a61f-d227c244b752'), -- Basic -> generate_image
('b1a7b002-c81b-4d43-a61f-d227c244b752', 'f1a7b001-c81b-4d43-a61f-d227c244b752'), -- Pro -> generate_image
('b1a7b002-c81b-4d43-a61f-d227c244b752', 'f1a7b002-c81b-4d43-a61f-d227c244b752'), -- Pro -> auto_post
('b1a7b002-c81b-4d43-a61f-d227c244b752', 'f1a7b003-c81b-4d43-a61f-d227c244b752'); -- Pro -> premium_templates
