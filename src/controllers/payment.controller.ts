import {repository, Where} from '@loopback/repository';
import {post, requestBody, Response, RestBindings} from '@loopback/rest';
import {inject} from '@loopback/context';
import {Order} from '../models';
import {OrderRepository, SettingRepository} from '../repositories';
import {AuthenticationBindings, authenticate} from '@loopback/authentication';
import {UserProfile} from '@loopback/security';
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
  ): Promise<object | undefined> {
    const emailSetting: any = await this.settingRepository.find({
      where: {key: 'email'},
    });
    const bccAddresses = await (emailSetting[0].value.bcc || '').split(',');
    const email = new emailtemplate({
      message: {
        from: `"Bestellungen Schneckenhof" <${emailSetting[0].value.from}>`,
      },
      send: true,
      transport: {
        host: 'smtp.strato.de',
        port: 465,
        auth: {
          user: 'bestellungen@weingut-schneckenhof.de',
          pass: 'Bestellungen@@@@@@',
        },
      },
      preview: false,
    });
    if (payOrder.items) {
      await email
        .send({
          template: 'invoice-admin',
          message: {to: emailSetting[0].value.to, bcc: bccAddresses},
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
        .then(async () => {
          console.log('New Order Email has been sent to Admin');
        });

      return email
        .send({
          template: 'invoice',
          message: {to: payOrder.email},
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
        .then(async () => {
          console.log('New Order Email has been sent to Client');
          await this.orderRepository.create({
            id: Math.floor(1000 + Math.random() * 900000),
            type: 'email',
            email: payOrder.email,
            total: payOrder.total,
            details: payOrder,
          } as Order);

          res.statusCode = 200;
          res.send({
            email: 'Email is sent',
            href: '/danke',
          });
        });
    } else {
      res.statusCode = 500;
      return {
        error: {
          statusCode: 500,
          message: 'No Items Have Been Selected',
        },
      };
    }
  }
}
