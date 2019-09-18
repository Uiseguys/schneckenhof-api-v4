"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const repository_1 = require("@loopback/repository");
const package_model_1 = require("./package.model");
let Wine = class Wine extends repository_1.Entity {
    constructor(data) {
        super(data);
    }
};
__decorate([
    repository_1.property({
        type: 'string',
        required: true,
    }),
    __metadata("design:type", String)
], Wine.prototype, "type", void 0);
__decorate([
    repository_1.property({
        type: 'string',
    }),
    __metadata("design:type", String)
], Wine.prototype, "name", void 0);
__decorate([
    repository_1.property({
        type: 'number',
        default: 0,
    }),
    __metadata("design:type", Number)
], Wine.prototype, "vintage", void 0);
__decorate([
    repository_1.property({
        type: 'number',
        id: true,
        default: 0
    }),
    __metadata("design:type", Number)
], Wine.prototype, "id", void 0);
__decorate([
    repository_1.property({
        type: 'number',
        required: true,
        default: 0,
        postgresql: {
            dataType: "NUMERIC(10,2)"
        }
    }),
    __metadata("design:type", Number)
], Wine.prototype, "price", void 0);
__decorate([
    repository_1.property({
        type: 'string',
    }),
    __metadata("design:type", String)
], Wine.prototype, "awardText", void 0);
__decorate([
    repository_1.property({
        type: 'string',
    }),
    __metadata("design:type", String)
], Wine.prototype, "awardLevel", void 0);
__decorate([
    repository_1.property({
        type: 'string',
        required: true,
    }),
    __metadata("design:type", String)
], Wine.prototype, "image", void 0);
__decorate([
    repository_1.property({
        type: 'boolean',
        required: true,
        default: true,
    }),
    __metadata("design:type", Boolean)
], Wine.prototype, "availability", void 0);
__decorate([
    repository_1.property({
        type: 'number',
        required: true,
        default: 0,
        postgresql: {
            dataType: "NUMERIC(10,2)"
        }
    }),
    __metadata("design:type", Number)
], Wine.prototype, "content", void 0);
__decorate([
    repository_1.property({
        type: 'string',
    }),
    __metadata("design:type", String)
], Wine.prototype, "varietal", void 0);
__decorate([
    repository_1.property({
        type: 'boolean',
        default: true,
    }),
    __metadata("design:type", Boolean)
], Wine.prototype, "premium", void 0);
__decorate([
    repository_1.property({
        type: 'number',
        required: true,
        default: 0,
    }),
    __metadata("design:type", Number)
], Wine.prototype, "priority", void 0);
__decorate([
    repository_1.property({
        type: 'number',
        default: 0,
    }),
    __metadata("design:type", Number)
], Wine.prototype, "no", void 0);
__decorate([
    repository_1.property({
        type: 'number',
        required: true,
        default: 0,
        postgresql: {
            dataType: "NUMERIC(10,2)"
        }
    }),
    __metadata("design:type", Number)
], Wine.prototype, "alcohol", void 0);
__decorate([
    repository_1.property({
        type: 'string'
    }),
    __metadata("design:type", String)
], Wine.prototype, "description", void 0);
__decorate([
    repository_1.belongsTo(() => package_model_1.Package),
    __metadata("design:type", Number)
], Wine.prototype, "packagingId", void 0);
Wine = __decorate([
    repository_1.model({ settings: { strict: false } }),
    __metadata("design:paramtypes", [Object])
], Wine);
exports.Wine = Wine;
//# sourceMappingURL=wine.model.js.map