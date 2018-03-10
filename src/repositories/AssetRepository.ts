import { EntityRepository, Repository } from 'typeorm';
import Asset from '../entities/Asset';

@EntityRepository(Asset)
export class AssetRepository extends Repository<Asset> {}
