import { DataSource, Repository } from '@loopback/repository';
import { WeingutApi } from './index';
import {
  UserRepository, SettingRepository, WineRepository, PackageRepository,
  RoleMappingRepository, RolesRepository,
  AclRepository, LogsRepository, TemplateRepository, ResourceRepository, OrderRepository

} from './repositories';

export async function dsMigrate(app: WeingutApi) {
  const ds = await app.get<DataSource>('datasources.db');
  const userRepo = await app.getRepository(UserRepository);
  const settRepo = await app.getRepository(SettingRepository);
  const wineRepo = await app.getRepository(WineRepository);
  const packRepo = await app.getRepository(PackageRepository);
  const rolemapRepo = await app.getRepository(RoleMappingRepository);
  const rolesRepo = await app.getRepository(RolesRepository);
  const aclRepo = await app.getRepository(AclRepository);
  const logRepo = await app.getRepository(LogsRepository);
  const templateRepo = await app.getRepository(TemplateRepository);
  const resourceRepo = await app.getRepository(ResourceRepository);
  const orderRepo = await app.getRepository(OrderRepository);
  await ds.automigrate();
}

export async function dsUpdate(app: WeingutApi) {

  const ds = await app.get<DataSource>('datasources.db');
  const userRepo = await app.getRepository(UserRepository);
  const settRepo = await app.getRepository(SettingRepository);
  const wineRepo = await app.getRepository(WineRepository);
  const packRepo = await app.getRepository(PackageRepository);
  const rolemapRepo = await app.getRepository(RoleMappingRepository);
  const rolesRepo = await app.getRepository(RolesRepository);
  const aclRepo = await app.getRepository(AclRepository);
  const logRepo = await app.getRepository(LogsRepository);
  const templateRepo = await app.getRepository(TemplateRepository);
  const resourceRepo = await app.getRepository(ResourceRepository);
  const orderRepo = await app.getRepository(OrderRepository);

  await ds.autoupdate();
}

