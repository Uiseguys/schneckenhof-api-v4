"use strict";
// Copyright IBM Corp. 2017,2018. All Rights Reserved.
// Node module: @loopback/example-todo
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const boot_1 = require("@loopback/boot");
const rest_explorer_1 = require("@loopback/rest-explorer");
const repository_1 = require("@loopback/repository");
const service_proxy_1 = require("@loopback/service-proxy");
const path = require("path");
const auth_strategy_provider_1 = require("./providers/auth-strategy.provider");
const sequence_1 = require("./sequence");
const rest_1 = require("@loopback/rest");
const authentication_1 = require("@loopback/authentication");
class WeingutApi extends boot_1.BootMixin(service_proxy_1.ServiceMixin(repository_1.RepositoryMixin(rest_1.RestApplication))) {
    constructor(options = {}) {
        super(options);
        this.projectRoot = __dirname;
        this.component(authentication_1.AuthenticationComponent);
        this.bind(authentication_1.AuthenticationBindings.STRATEGY).toProvider(auth_strategy_provider_1.MyAuthStrategyProvider);
        // Set up the custom sequence
        this.sequence(sequence_1.MySequence);
        // Set up default home page
        this.static('/', path.join(__dirname, '../../public'));
        this.static('/schneckenhof-dev', path.join(__dirname, '../../schneckenhof-dev'));
        this.component(rest_explorer_1.RestExplorerComponent);
        this.projectRoot = __dirname;
        // Customize @loopback/boot Booter Conventions here
        this.bootOptions = {
            controllers: {
                // Customize ControllerBooter Conventions here
                dirs: ['controllers'],
                extensions: ['.controller.js'],
                nested: true,
            },
        };
    }
}
exports.WeingutApi = WeingutApi;
//# sourceMappingURL=application.js.map