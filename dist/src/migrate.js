"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const repositories_1 = require("./repositories");
async function dsMigrate(app) {
    const ds = await app.get('datasources.db');
    const userRepo = await app.getRepository(repositories_1.UserRepository);
    const settRepo = await app.getRepository(repositories_1.SettingRepository);
    const wineRepo = await app.getRepository(repositories_1.WineRepository);
    const packRepo = await app.getRepository(repositories_1.PackageRepository);
    const rolemapRepo = await app.getRepository(repositories_1.RoleMappingRepository);
    const rolesRepo = await app.getRepository(repositories_1.RolesRepository);
    const aclRepo = await app.getRepository(repositories_1.AclRepository);
    const logRepo = await app.getRepository(repositories_1.LogsRepository);
    const templateRepo = await app.getRepository(repositories_1.TemplateRepository);
    const resourceRepo = await app.getRepository(repositories_1.ResourceRepository);
    const orderRepo = await app.getRepository(repositories_1.OrderRepository);
    const newsRepo = await app.getRepository(repositories_1.NewsRepository);
    await ds.automigrate();
}
exports.dsMigrate = dsMigrate;
async function dsUpdate(app) {
    const ds = await app.get('datasources.db');
    const userRepo = await app.getRepository(repositories_1.UserRepository);
    const settRepo = await app.getRepository(repositories_1.SettingRepository);
    const wineRepo = await app.getRepository(repositories_1.WineRepository);
    const packRepo = await app.getRepository(repositories_1.PackageRepository);
    const rolemapRepo = await app.getRepository(repositories_1.RoleMappingRepository);
    const rolesRepo = await app.getRepository(repositories_1.RolesRepository);
    const aclRepo = await app.getRepository(repositories_1.AclRepository);
    const logRepo = await app.getRepository(repositories_1.LogsRepository);
    const templateRepo = await app.getRepository(repositories_1.TemplateRepository);
    const resourceRepo = await app.getRepository(repositories_1.ResourceRepository);
    const orderRepo = await app.getRepository(repositories_1.OrderRepository);
    const newsRepo = await app.getRepository(repositories_1.NewsRepository);
    await ds.autoupdate();
}
exports.dsUpdate = dsUpdate;
/*
export * from './user.repository';
export * from './setting.repository';
export * from './wine.repository';
export * from './package.repository';
export * from './roles.repository';
export * from './acl.repository';
export * from './logs.repository';
export * from './role-mapping.repository';
export * from './template.repository';
export * from './resource.repository';
export * from './order.repository';





*/
//# sourceMappingURL=migrate.js.map