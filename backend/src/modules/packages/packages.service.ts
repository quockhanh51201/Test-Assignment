import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Package } from './entities/package.entity';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { Feature } from '../features/entities/feature.entity';

@Injectable()
export class PackagesService {
  constructor(
    @InjectRepository(Package)
    private readonly packageRepository: Repository<Package>,
    @InjectRepository(Feature)
    private readonly featureRepository: Repository<Feature>,
  ) {}

  async create(createPackageDto: CreatePackageDto): Promise<Package> {
    const { featureIds, ...packageData } = createPackageDto;
    
    const newPackage = this.packageRepository.create(packageData);
    
    if (featureIds && featureIds.length > 0) {
      const features = await this.featureRepository.findBy({ id: In(featureIds) });
      newPackage.features = features;
    }

    return await this.packageRepository.save(newPackage);
  }

  async findAll(): Promise<Package[]> {
    return await this.packageRepository.find({
      relations: ['features'],
    });
  }

  async findOne(id: string): Promise<Package> {
    const pkg = await this.packageRepository.findOne({
      where: { id },
      relations: ['features'],
    });
    if (!pkg) {
      throw new NotFoundException(`Package with ID ${id} not found`);
    }
    return pkg;
  }

  async update(id: string, updatePackageDto: UpdatePackageDto): Promise<Package> {
    const pkg = await this.findOne(id);
    const { featureIds, ...updateData } = updatePackageDto;

    Object.assign(pkg, updateData);

    if (featureIds) {
      const features = await this.featureRepository.findBy({ id: In(featureIds) });
      pkg.features = features;
    }

    return await this.packageRepository.save(pkg);
  }

  async remove(id: string): Promise<void> {
    const pkg = await this.findOne(id);
    await this.packageRepository.remove(pkg);
  }
}
