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
let News = class News extends repository_1.Entity {
    constructor(data) {
        super(data);
    }
};
__decorate([
    repository_1.property({
        type: 'date',
        required: true,
    }),
    __metadata("design:type", Date)
], News.prototype, "relevantFrom", void 0);
__decorate([
    repository_1.property({
        type: 'date',
        required: true,
    }),
    __metadata("design:type", Date)
], News.prototype, "relevantTo", void 0);
__decorate([
    repository_1.property({
        type: 'string',
        required: true
    }),
    __metadata("design:type", String)
], News.prototype, "title", void 0);
__decorate([
    repository_1.property({
        type: 'number',
        id: true,
        default: 0
    }),
    __metadata("design:type", Number)
], News.prototype, "id", void 0);
__decorate([
    repository_1.property({
        type: 'string',
        required: false,
    }),
    __metadata("design:type", String)
], News.prototype, "shortDescription", void 0);
__decorate([
    repository_1.property({
        type: 'string',
        required: false
    }),
    __metadata("design:type", Number)
], News.prototype, "description", void 0);
__decorate([
    repository_1.property({
        type: 'string',
        required: false,
        default: ""
    }),
    __metadata("design:type", String)
], News.prototype, "homePageDescription", void 0);
__decorate([
    repository_1.property({
        type: 'boolean',
        required: false,
        default: false
    }),
    __metadata("design:type", Boolean)
], News.prototype, "showOnHome", void 0);
__decorate([
    repository_1.property({
        type: 'date',
        required: true,
    }),
    __metadata("design:type", Date)
], News.prototype, "startDate", void 0);
__decorate([
    repository_1.property({
        type: 'date',
        required: true,
    }),
    __metadata("design:type", Date)
], News.prototype, "endDate", void 0);
News = __decorate([
    repository_1.model(),
    __metadata("design:paramtypes", [Object])
], News);
exports.News = News;
//# sourceMappingURL=news.model.js.map