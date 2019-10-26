import {repository, Where} from '@loopback/repository';
import {post, requestBody, Response, RestBindings} from '@loopback/rest';
import {inject} from '@loopback/context';
import {Order} from '../models';
import {OrderRepository, SettingRepository} from '../repositories';
import {AuthenticationBindings, authenticate} from '@loopback/authentication';
import {UserProfile} from '@loopback/security';
import * as nodemailer from 'nodemailer';
import * as emailtemplate from 'email-templates';

export class PaymentController {
  constructor(
    @repository(OrderRepository)
    public orderRepository: OrderRepository,
    @repository(SettingRepository)
    public settingRepository: SettingRepository,
    @inject(AuthenticationBindings.CURRENT_USER, {optional: true})
    private user: UserProfile,
  ) {}

  @post('/payment/checkout')
  async checkout(
    @requestBody({
      description: 'Checkout Data',
      content: {
        'application/x-www-form-urlencoded': {
          schema: {
            type: 'object',
          },
        },
      },
    })
    payOrder: any,
    @inject(RestBindings.Http.RESPONSE) res: Response,
  ): Promise<object> {
    const self = this;
    console.log(payOrder);
    return new Promise((resolve, reject) => {
      this.orderRepository.create(
        {
          id: Math.floor(1000 + Math.random() * 900000),
          type: 'email',
          email: payOrder.email,
          total: payOrder.total,
          details: payOrder,
        } as Order,
        (err: any, response: any) => {
          if (err) {
            console.log(err);
            reject(err);
          } else {
            self.settingRepository.find({where: {key: 'email'}}, function(
              err: any,
              settingInstance: any,
            ) {
              if (err) {
                console.log(err);
                reject(err);
              }
              const emailSetting = settingInstance[0].value;
              const toAddresses = (emailSetting.to || '').split(',');
              const email = new emailtemplate({
                message: {
                  from: emailSetting.from,
                },
                transport: {
                  jsonTransport: true,
                },
                preview: true,
              });

              email
                .send({
                  template: 'invoice',
                  message: {to: toAddresses},
                  locals: {
                    realname: payOrder.realname,
                    items: payOrder.items,
                    email: payOrder.email,
                    street: payOrder.street,
                    zip: payOrder.zip,
                    city: payOrder.city,
                    phone: payOrder.phone,
                    message: payOrder.message,
                  },
                })
                .then((emailtemplate: any) => {
                  const transporter = nodemailer.createTransport({
                    host: 'smtp.strato.de',
                    port: 465,
                    auth: {
                      user: 'bestellungen@weingut-schneckenhof.de',
                      pass: 'Bestellungen@@@@@@',
                    },
                  });

                  const templates = JSON.parse(emailtemplate.message);
                  const message = {
                    from: templates.from.address,
                    to: templates.to[0].address,
                    subject: templates.subject,
                    text: templates.text,
                    html: templates.html,
                    cc: emailSetting.cc,
                  };

                  transporter.sendMail(message, function(err) {
                    if (err) {
                      console.log('Error occured');
                      console.log(err.message);
                      reject(err);
                    }
                    resolve({
                      email: 'Email is sent',
                      href: '/danke',
                    });
                  });
                })
                .catch((err: Error) => {
                  console.log(err);
                  reject(err);
                });
            });
          }
        },
      );
    });
  }
}
