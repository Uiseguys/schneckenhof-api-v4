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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const context_1 = require("@loopback/context");
const models_1 = require("../models");
const repositories_1 = require("../repositories");
const authentication_1 = require("@loopback/authentication");
let OrderController = class OrderController {
    constructor(orderRepository, user) {
        this.orderRepository = orderRepository;
        this.user = user;
    }
    // @post('/Orders', {
    //   responses: {
    //     '200': {
    //       description: 'Order model instance',
    //       content: {'application/json': {schema: {'x-ts-type': Order}}},
    //     },
    //   },
    // })
    // async create(@requestBody() order: Order): Promise<Order> {
    //   return await this.orderRepository.create(order);
    // }
    async count(where) {
        return await this.orderRepository.count(where);
    }
    async find(filter) {
        return await this.orderRepository.find(filter);
    }
    /*@patch('/Orders', {
      responses: {
        '200': {
          description: 'Order PATCH success count',
          content: {'application/json': {schema: CountSchema}},
        },
      },
    })
    async updateAll(
      @requestBody() order: Order,
      @param.query.object('where', getWhereSchemaFor(Order)) where?: Where,
    ): Promise<Count> {
      return await this.orderRepository.updateAll(order, where);
    }*/
    async findById(id) {
        return await this.orderRepository.findById(id);
    }
    /*@patch('/Orders/{id}', {
      responses: {
        '204': {
          description: 'Order PATCH success',
        },
      },
    })
    async updateById(
      @param.path.number('id') id: number,
      @requestBody() order: Order,
    ): Promise<void> {
      await this.orderRepository.updateById(id, order);
    }*/
    async deleteById(id) {
        await this.orderRepository.deleteById(id);
    }
};
__decorate([
    rest_1.get('/Orders/count', {
        responses: {
            '200': {
                description: 'Order model count',
                content: { 'application/json': { schema: repository_1.CountSchema } },
            },
        },
    }),
    __param(0, rest_1.param.query.object('where', rest_1.getWhereSchemaFor(models_1.Order))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "count", null);
__decorate([
    rest_1.get('/Orders', {
        responses: {
            '200': {
                description: 'Array of Order model instances',
                content: {
                    'application/json': {
                        schema: { type: 'array', items: { 'x-ts-type': models_1.Order } },
                    },
                },
            },
        },
    }),
    __param(0, rest_1.param.query.object('filter', rest_1.getFilterSchemaFor(models_1.Order))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "find", null);
__decorate([
    rest_1.get('/Orders/{id}', {
        responses: {
            '200': {
                description: 'Order model instance',
                content: { 'application/json': { schema: { 'x-ts-type': models_1.Order } } },
            },
        },
    }),
    __param(0, rest_1.param.path.number('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "findById", null);
__decorate([
    authentication_1.authenticate('BasicStrategy'),
    rest_1.del('/Orders/{id}', {
        responses: {
            '204': {
                description: 'Order DELETE success',
            },
        },
    }),
    __param(0, rest_1.param.path.number('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "deleteById", null);
OrderController = __decorate([
    __param(0, repository_1.repository(repositories_1.OrderRepository)),
    __param(1, context_1.inject(authentication_1.AuthenticationBindings.CURRENT_USER, { optional: true })),
    __metadata("design:paramtypes", [repositories_1.OrderRepository, Object])
], OrderController);
exports.OrderController = OrderController;
//# sourceMappingURL=order.controller.js.map