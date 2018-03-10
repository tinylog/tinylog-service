import { EntityRepository, Repository } from 'typeorm';
import Host from '../entities/Host';

@EntityRepository(Host)
export class HostRepository extends Repository<Host> {}
