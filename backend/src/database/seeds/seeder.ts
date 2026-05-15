import { AppDataSource } from '../../data-source';
import { Feature } from '../../modules/features/entities/feature.entity';
import { Package } from '../../modules/packages/entities/package.entity';

async function seed() {
  // Kết nối tới Database
  await AppDataSource.initialize();
  console.log('Database connected!');

  const featureRepo = AppDataSource.getRepository(Feature);
  const packageRepo = AppDataSource.getRepository(Package);

  // 1. Seed Features (Danh mục tính năng)
  const featuresData = [
    { code: 'generate_image', name: 'AI Image Generator', description: 'Tạo ảnh bằng AI' },
    { code: 'auto_post', name: 'Auto Social Post', description: 'Tự động đăng bài mạng xã hội' },
    { code: 'premium_templates', name: 'Premium Templates', description: 'Mẫu thiết kế cao cấp' }
  ];

  const savedFeatures: Feature[] = [];
  for (const f of featuresData) {
    let feature = await featureRepo.findOneBy({ code: f.code });
    if (!feature) {
      feature = featureRepo.create(f);
      feature = await featureRepo.save(feature);
      console.log(`Created feature: ${f.name}`);
    }
    savedFeatures.push(feature);
  }

  // 2. Seed Packages (Các gói tín dụng)
  const packagesData = [
    {
      name: 'Gói Cơ Bản (Basic)',
      description: 'Dành cho người mới bắt đầu',
      price: 50000,
      credits: 100,
      features: [savedFeatures[0]] // Chỉ có generate_image
    },
    {
      name: 'Gói Chuyên Nghiệp (Pro)',
      description: 'Đầy đủ tính năng cao cấp',
      price: 200000,
      credits: 500,
      features: savedFeatures // Có tất cả tính năng
    }
  ];

  for (const p of packagesData) {
    let pkg = await packageRepo.findOneBy({ name: p.name });
    if (!pkg) {
      pkg = packageRepo.create(p);
      await packageRepo.save(pkg);
      console.log(`Created package: ${p.name}`);
    }
  }

  console.log('🌱 Seeding Data Completed!');
  process.exit();
}

seed().catch(error => {
  console.error('Lỗi khi seed data:', error);
  process.exit(1);
});
