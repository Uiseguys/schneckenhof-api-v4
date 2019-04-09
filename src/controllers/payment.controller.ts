
import {
    Count,
    CountSchema,
    Filter,
    repository,
    Where,
} from '@loopback/repository';
import {
    param,
    get,
    getFilterSchemaFor,
    getWhereSchemaFor,
    del,
    post,
    requestBody,
    RestBindings,
    Response,
    Request
} from '@loopback/rest';
import { inject } from '@loopback/context';
import * as paypal from "paypal-rest-sdk";
import * as emailtemplate from "email-templates";
import * as path from 'path';
//import * as sendemail from "sendemail";
import { Order, Setting, Payment } from '../models';
import { OrderRepository } from '../repositories';
import { SettingRepository } from '../repositories';
import * as config from '../datasources/db.datasource.json';
import * as nodemailer from 'nodemailer';
var sgTransport = require('nodemailer-sendgrid-transport');

import { AuthenticationBindings, UserProfile, authenticate } from '@loopback/authentication';


export class PaymentController {
    constructor(
        @repository(OrderRepository) public orderRepository: OrderRepository,
        @repository(SettingRepository) public settingRepository: SettingRepository,
        @inject(AuthenticationBindings.CURRENT_USER, { optional: true }) private user: UserProfile
    ) {

    }

    @post('/payment/checkout')
    async checkout(@requestBody({
        description: 'Checkout Data',
        content: {
            'application/x-www-form-urlencoded': {
                schema: {
                    type: 'object'
                },
            },
        }
    }) payment: Payment, @inject(RestBindings.Http.REQUEST) request: Request, @inject(RestBindings.Http.RESPONSE) response: Response): Promise<object> {
        return new Promise<object>((resolve, reject) => {
            request.body.items = request.body.items || [];
            if (payment.pay_method === 'paypal') {
                this.orderRepository.create(
                    {
                        id: Math.floor(1000 + Math.random() * 9000),
                        type: 'paypal',
                        email: request.body.email,
                        total: request.body.total,
                        details: request.body,
                        created: new Date(),
                    }, function (err: any, instance: any) {

                        paypal.configure({
                            mode: config.paypaldev.mode,
                            client_id: config.paypaldev.client_id,
                            client_secret: config.paypaldev.client_secret
                        });
                        let create_payment_json: any = {
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

                        paypal.payment.create(create_payment_json, function (error: any, payment: any) {
                            if (error) {
                                reject(error)
                            } else {
                                resolve(payment.links[1]);
                            }
                        });
                    }
                );
            } else {
                let self = this;
                this.orderRepository.create(
                    {
                        id: Math.floor(1000 + Math.random() * 9000),
                        type: 'email',
                        email: request.body.email,
                        total: request.body.total,
                        details: request.body,
                        created: new Date(),
                    }, function (err: any, res: any) {
                        if (err) {
                            reject(err);
                        } else {
                            self.settingRepository.find({ where: { key: 'email' } },
                                function (err: any, settingInstance: any) {
                                    const emailSetting = settingInstance[0].value;
                                    const toAddresses = (emailSetting.to || '').split(',');
                                    const email = new emailtemplate(
                                        {
                                            message: {
                                                from: emailSetting.from
                                            },
                                            transport: {
                                                jsonTransport: true
                                            },
                                            preview: false
                                        }
                                    );

                                    email.send(
                                        {
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
                                        }
                                    ).
                                        then(function (emailtemplate: any) {

                                            var options = {
                                                auth: {
                                                    api_key: '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'
                                                }
                                            }
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
                                                html: templates.html
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
                                        })
                                }
                            );

                        }
                    })
            }
        });
    }

    @get('/payment/execute')
    async execute(@inject(RestBindings.Http.REQUEST) request: Request, @inject(RestBindings.Http.RESPONSE) response: Response): Promise<object> {
        return new Promise<object>((resolve, reject) => {
            let self = this;
            paypal.configure(
                {
                    mode: config.paypaldev.mode,
                    client_id: config.paypaldev.client_id,
                    client_secret: config.paypaldev.client_secret
                }
            );

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
                }
                paypal.payment.execute(paymentId, data, function (err: any, payment: any) {
                    if (err) {
                        reject(err)
                    } else {
                        self.orderRepository.find({ where: { id: parseInt(payment.transactions[0].invoice_number) } }, function (err: any, payment: any) {
                            if (err) {
                                reject(err);
                            } else {

                                let data = {
                                    completed: new Date()
                                }
                                self.orderRepository.updateAll(data, { id: parseInt(payment.transactions[0].invoice_number) }, function (err: any, order: any) {
                                    self.settingRepository.findOne(
                                        {
                                            where: { key: 'email' },
                                        }, function (err: any, settingInstance: any) {
                                            const emailSetting = settingInstance.value;
                                            const toAddresses = (emailSetting.to || '').split(',');
                                            const email = new emailtemplate(
                                                {
                                                    message: {
                                                        from: emailSetting.from
                                                    },
                                                    transport: {
                                                        jsonTransport: true
                                                    },
                                                    preview: false
                                                }
                                            );

                                            email.send(
                                                {
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
                                                }
                                            ).
                                                then(function (emailtemplate: any) {
                                                    resolve({
                                                        email: "Email is sent"
                                                    });
                                                })
                                        }
                                    );
                                })
                            }
                        })
                    }
                })
            });
        });
    }
}





