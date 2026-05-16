import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Feature } from './entities/feature.entity';
import { CreateFeatureDto } from './dto/create-feature.dto';
import { UpdateFeatureDto } from './dto/update-feature.dto';

@Injectable()
export class FeaturesService {
  constructor(
    @InjectRepository(Feature)
    private readonly featureRepository: Repository<Feature>,
  ) {}

  async create(createFeatureDto: CreateFeatureDto): Promise<Feature> {
    const feature = this.featureRepository.create(createFeatureDto);
    return await this.featureRepository.save(feature);
  }

  async findAll(): Promise<Feature[]> {
    return await this.featureRepository.find();
  }

  async findOne(id: string): Promise<Feature> {
    const feature = await this.featureRepository.findOne({ where: { id } });
    if (!feature) {
      throw new NotFoundException(`Feature with ID ${id} not found`);
    }
    return feature;
  }

  async update(id: string, updateFeatureDto: UpdateFeatureDto): Promise<Feature> {
    const feature = await this.findOne(id);
    Object.assign(feature, updateFeatureDto);
    return await this.featureRepository.save(feature);
  }

  async remove(id: string): Promise<void> {
    const feature = await this.findOne(id);
    await this.featureRepository.remove(feature);
  }
}
