import { EntityRepository, Repository } from 'typeorm';
import { Asset } from '../entities/Asset';
import { Host } from '../entities/Host';
import { ISimpleFilter, ISlowestAssetItem } from '../interfaces/Host';

@EntityRepository(Asset)
export class AssetRepository extends Repository<Asset> {
  async createAssets(assets: Array<Partial<Asset>>): Promise<Asset[]> {
    return await this.save(this.create(assets));
  }

  /**
   * 慢连接查询
   */
  async getSlowestAssetList(host: Host, filter: ISimpleFilter): Promise<ISlowestAssetItem[]> {
    return await this.query(
      `
      SELECT AVG(asset.duration) as avgDuration,
             AVG(asset.redirect) as avgRedirect,
             AVG(asset.lookupDomain) as avgLookupDomain,
             AVG(asset.request) as avgRequest,
             asset.name as name,
             asset.entryType as entryType
      FROM   asset
      WHERE  asset.pageId in (
        SELECT id
        FROM   page
        WHERE  page.hostId = ?
          AND  page.createdAt between ? and ?
      )
      GROUP BY name, entryType
      ORDER BY avgDuration DESC
      LIMIT 0, 10
      `,
      [host.id, filter.from, filter.to]
    );
  }
}
