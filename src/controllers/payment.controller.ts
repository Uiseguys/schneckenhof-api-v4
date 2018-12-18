
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
  import {inject} from '@loopback/context';
  import * as paypal from "paypal-rest-sdk";
  import * as emailtemplate from "email-templates";
  import * as path from 'path';
  //import * as sendemail from "sendemail";
  import { Order,Setting,Payment } from '../models';
  import {OrderRepository} from '../repositories';
  import {SettingRepository} from '../repositories';
  import * as config from '../datasources/db.datasource.json';
  import * as nodemailer from 'nodemailer';
  

  export class PaymentController {
      constructor(
        @repository(OrderRepository)public orderRepository: OrderRepository,
        @repository(SettingRepository)public settingRepository: SettingRepository
      ){
        
      }

      @post('/checkout')
      async checkout(@requestBody({
      }) payment: Payment,@inject(RestBindings.Http.REQUEST) request: Request,@inject(RestBindings.Http.RESPONSE) response: Response): Promise<object> {
        return new Promise<object>((resolve, reject) => {
            request.body.items = request.body.items || [];
            if(payment.pay_method === 'paypal') {
                this.orderRepository.create(
                {
                    id:123,
                    type: 'paypal',
                    email: "abc@gmail.com",
                    total: 20.0,
                    details: {
                        test:"test"
                    },
                    created: new Date(),
                }, function(err:any, instance:any){
                   
                   paypal.configure({
                        mode: config.paypaldev.mode,
                        client_id: config.paypaldev.client_id,
                        client_secret: config.paypaldev.client_secret
                    });
                    let create_payment_json:any = {
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
                                items: [
                                    {
                                        name: "Test item 1",
                                        sku: "Test item 1",
                                        price: "10.00",
                                        currency: "EUR",
                                        quantity: 1
                                    },
                                    {
                                        name: "Test item 2",
                                        sku: "Test item 2",
                                        price: "10.00",
                                        currency: "EUR",
                                        quantity: 1
                                    }
                                ],
                            },
                            amount: {
                                currency: 'EUR',
                                total: 20.00
                            },
                            description: 'Weingut Schneckenhof',
                        }
                      ]
                    };
        
                    paypal.payment.create(create_payment_json, function (error:any, payment:any) {
                        if (error) {
                            reject(error)
                          } else {     
                            resolve(payment.links[1]);
                          }  
                    });
                }
            );
         }else{
                let self = this;
                this.orderRepository.create(
                    {
                        id:123,
                        type: 'email',
                        email: "gdfgdf",
                        total: 20.0,
                        details: {
                            abc:"test"
                        },
                        created: new Date(), 
                    },function(){
                        self.settingRepository.find({where: {key: 'email'}},
                            function(err:any,settingInstance:any){
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
                                           preview:false
                                       }
                                     );
                        
                                    email.send(
                                        {
                                            template: 'invoice',
                                            message: {to: toAddresses},
                                            locals: {
                                                realname:"Test",
                                                items:[
                                                    {
                                                        quantity:"2",
                                                        name:"Test item"
                                                    },
                                                    {
                                                        quantity:"1",
                                                        name:"Test item 1"
                                                    }
                                                ],
                                                email:"test@gmail.com",
                                                street:"Test street",
                                                zip:"12345678",
                                                city:"Test city",
                                                phone:"1234567890",
                                                message:"Test Message"
                                            }
                                        }
                                      ).
                                    then(function(emailtemplate:any){
                                        var transport = nodemailer.createTransport({
                                            service: 'gmail',
                                            auth:{
                                                user: 'anku@rudrainnovative.com',
                                                pass: 'anku@1234'
                                            }
                                        })

                                        let templates = JSON.parse(emailtemplate.message); 
                                        var message = {
                                            from: templates.from.address,
                                            to: templates.to[0].address,
                                            subject: templates.subject, 
                                            text: templates.text,
                                            html:templates.html
                                        };

                                        transport.sendMail(message, function(error){
                                            if(error){
                                                console.log('Error occured');
                                                console.log(error.message);
                                                return;
                                            }
                                            resolve({
                                                email:"Email is sent"
                                             });
                                          });     
                                 })
                            }
                     );
                })
              }
        }); 
      }

      @get('/execute')
      async execute(@requestBody({
    }) @inject(RestBindings.Http.REQUEST) request: Request,@inject(RestBindings.Http.RESPONSE) response: Response): Promise<object> {
        return new Promise<object>((resolve, reject) => {
              let self = this;
              paypal.configure(
                  {
                    mode: config.paypaldev.mode,
                    client_id: config.paypaldev.client_id,
                    client_secret: config.paypaldev.client_secret
                  }
              );

              const {paymentId, PayerID} = request.query;
              paypal.payment.get(paymentId, function(err,payment){
                  if(err){
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
                  paypal.payment.execute(paymentId,data,function(err:any,payment:any){
                        if(err){
                            reject(err)
                        }else{
                            self.orderRepository.find({where: {id:parseInt(payment.transactions[0].invoice_number)}},function(err:any,payment:any){
                                if(err){
                                    reject(err);
                                }else{
                                   
                                    let data = {
                                        completed:new Date()
                                    }
                                    self.orderRepository.updateAll(data,{id:parseInt(payment.transactions[0].invoice_number)},function(err:any,order:any){
                                        self.settingRepository.findOne(
                                            {
                                              where: {key: 'email'},
                                            },function(err:any,settingInstance:any){
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
                                                           preview:false
                                                       }
                                                     );
                                        
                                                    email.send(
                                                        {
                                                            template: 'invoice',
                                                            message: {to: toAddresses},
                                                            locals: {
                                                                realname:"Test",
                                                                items:[
                                                                    {
                                                                        quantity:"2",
                                                                        name:"Test item"
                                                                    },
                                                                    {
                                                                        quantity:"1",
                                                                        name:"Test item 1"
                                                                    }
                                                                ],
                                                                invoiceId: order.id,
                                                                email:"test@gmail.com",
                                                                street:"Test street",
                                                                zip:"12345678",
                                                                city:"Test city",
                                                                phone:"1234567890",
                                                                message:"Test Message"
                                                            }
                                                        }
                                                      ).
                                                    then(function(emailtemplate:any){
                                                        resolve({
                                                            email:"Email is sent"
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

  



