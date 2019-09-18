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
const paypal = require("paypal-rest-sdk");
const emailtemplate = require("email-templates");
//import * as sendemail from "sendemail";
const models_1 = require("../models");
const repositories_1 = require("../repositories");
const repositories_2 = require("../repositories");
const config = require("../datasources/db.datasource.json");
const nodemailer = require("nodemailer");
var sgTransport = require('nodemailer-sendgrid-transport');
const authentication_1 = require("@loopback/authentication");
let PaymentController = class PaymentController {
    constructor(orderRepository, settingRepository, user) {
        this.orderRepository = orderRepository;
        this.settingRepository = settingRepository;
        this.user = user;
    }
    async checkout(payment, request, response) {
        return new Promise((resolve, reject) => {
            request.body.items = request.body.items || [];
            if (payment.pay_method === 'paypal') {
                this.orderRepository.create({
                    id: Math.floor(1000 + Math.random() * 900000),
                    type: 'paypal',
                    email: request.body.email,
                    total: request.body.total,
                    details: request.body,
                    created: new Date(),
                }, function (err, instance) {
                    paypal.configure({
                        mode: config.paypaldev.mode,
                        client_id: config.paypaldev.client_id,
                        client_secret: config.paypaldev.client_secret
                    });
                    let create_payment_json = {
                        intent: "sale",
                        "payer": {
                            "payment_method": "paypal"
                        },
                        redirect_urls: {
                            return_url: config.paypaldev.return_url,
                            cancel_url: config.paypaldev.cancel_url
                        },
                        transactions: [
                            {
                                invoice_number: instance.id,
                                item_list: {
                                    items: request.body.items
                                },
                                amount: {
                                    currency: 'EUR',
                                    total: request.body.total,
                                    details: {
                                        subtotal: request.body.subtotal,
                                        shipping: request.body.shipping
                                    },
                                },
                                description: 'Weingut Schneckenhof',
                            }
                        ]
                    };
                    paypal.payment.create(create_payment_json, function (error, payment) {
                        if (error) {
                            reject(error);
                        }
                        else {
                            resolve(payment.links[1]);
                        }
                    });
                });
            }
            else {
                let self = this;
                this.orderRepository.create({
                    id: Math.floor(1000 + Math.random() * 9000),
                    type: 'email',
                    email: request.body.email,
                    total: request.body.total,
                    details: request.body,
                    created: new Date(),
                }, function (err, res) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        self.settingRepository.find({ where: { key: 'email' } }, function (err, settingInstance) {
                            const emailSetting = settingInstance[0].value;
                            const toAddresses = (emailSetting.to || '').split(',');
                            const email = new emailtemplate({
                                message: {
                                    from: emailSetting.from
                                },
                                transport: {
                                    jsonTransport: true
                                },
                                preview: false
                            });
                            email.send({
                                template: 'invoice',
                                message: { to: toAddresses },
                                locals: {
                                    realname: request.body.realname,
                                    items: request.body.items,
                                    email: request.body.email,
                                    street: request.body.street,
                                    zip: request.body.zip,
                                    city: request.body.city,
                                    phone: request.body.phone,
                                    message: request.body.message
                                }
                            }).
                                then(function (emailtemplate) {
                                var options = {
                                    auth: {
                                        api_user: process.env.SENDGRID_USERNAME || '',
                                        api_key: process.env.SENDGRID_PASSWORD || ''
                                    }
                                };
                                // var transport = nodemailer.createTransport({
                                //     service: 'gmail',
                                //     auth: {
                                //         user: config.email.user,
                                //         pass: config.email.password
                                //     }
                                // })
                                var transport = nodemailer.createTransport(sgTransport(options));
                                let templates = JSON.parse(emailtemplate.message);
                                var message = {
                                    from: templates.from.address,
                                    to: templates.to[0].address,
                                    subject: templates.subject,
                                    text: templates.text,
                                    html: templates.html,
                                    cc: emailSetting.cc
                                };
                                transport.sendMail(message, function (error) {
                                    if (error) {
                                        console.log('Error occured');
                                        console.log(error.message);
                                        return;
                                    }
                                    resolve({
                                        email: "Email is sent",
                                        href: "/danke"
                                    });
                                });
                            });
                        });
                    }
                });
            }
        });
    }
    async execute(request, response) {
        return new Promise((resolve, reject) => {
            let self = this;
            paypal.configure({
                mode: config.paypaldev.mode,
                client_id: config.paypaldev.client_id,
                client_secret: config.paypaldev.client_secret
            });
            const { paymentId, PayerID } = request.query;
            paypal.payment.get(paymentId, function (err, payment) {
                if (err) {
                    reject(err);
                }
                let data = {
                    payer_id: PayerID,
                    transactions: [
                        {
                            amount: payment.transactions[0].amount,
                        },
                    ],
                };
                paypal.payment.execute(paymentId, data, function (err, payment) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        self.orderRepository.find({ where: { id: parseInt(payment.transactions[0].invoice_number) } }, function (err, payment) {
                            if (err) {
                                reject(err);
                            }
                            else {
                                let data = {
                                    completed: new Date()
                                };
                                self.orderRepository.updateAll(data, { id: parseInt(payment.transactions[0].invoice_number) }, function (err, order) {
                                    self.settingRepository.findOne({
                                        where: { key: 'email' },
                                    }, function (err, settingInstance) {
                                        const emailSetting = settingInstance.value;
                                        const toAddresses = (emailSetting.to || '').split(',');
                                        const email = new emailtemplate({
                                            message: {
                                                from: emailSetting.from
                                            },
                                            transport: {
                                                jsonTransport: true
                                            },
                                            preview: false
                                        });
                                        email.send({
                                            template: 'invoice',
                                            message: { to: toAddresses },
                                            locals: {
                                                realname: request.body.realname,
                                                items: request.body.items,
                                                invoiceId: order.id,
                                                email: request.body.email,
                                                street: request.body.street,
                                                zip: request.body.zip,
                                                city: request.body.city,
                                                phone: request.body.phone,
                                                message: request.body.message
                                            }
                                        }).
                                            then(function (emailtemplate) {
                                            resolve({
                                                email: "Email is sent"
                                            });
                                        });
                                    });
                                });
                            }
                        });
                    }
                });
            });
        });
    }
};
__decorate([
    rest_1.post('/payment/checkout'),
    __param(0, rest_1.requestBody({
        description: 'Checkout Data',
        content: {
            'application/x-www-form-urlencoded': {
                schema: {
                    type: 'object'
                },
            },
        }
    })), __param(1, context_1.inject(rest_1.RestBindings.Http.REQUEST)), __param(2, context_1.inject(rest_1.RestBindings.Http.RESPONSE)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [models_1.Payment, Object, Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "checkout", null);
__decorate([
    rest_1.get('/payment/execute'),
    __param(0, context_1.inject(rest_1.RestBindings.Http.REQUEST)), __param(1, context_1.inject(rest_1.RestBindings.Http.RESPONSE)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "execute", null);
PaymentController = __decorate([
    __param(0, repository_1.repository(repositories_1.OrderRepository)),
    __param(1, repository_1.repository(repositories_2.SettingRepository)),
    __param(2, context_1.inject(authentication_1.AuthenticationBindings.CURRENT_USER, { optional: true })),
    __metadata("design:paramtypes", [repositories_1.OrderRepository,
        repositories_2.SettingRepository, Object])
], PaymentController);
exports.PaymentController = PaymentController;
//# sourceMappingURL=payment.controller.js.map