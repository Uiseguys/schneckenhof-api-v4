"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
const application_1 = require("./application");
exports.WeingutApi = application_1.WeingutApi;
const migrate_1 = require("./migrate");
async function main(options = {}) {
    const app = new application_1.WeingutApi(options);
    await app.boot();
    await app.start();
    const url = app.restServer.url;
    console.log(`Server is running at ${url}`);
    await migrate_1.dsUpdate(app);
    return app;
}
exports.main = main;
__export(require("./models"));
__export(require("./repositories"));
__export(require("@loopback/rest"));
//# sourceMappingURL=index.js.map