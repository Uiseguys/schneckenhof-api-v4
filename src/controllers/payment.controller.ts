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
  ): Promise<object | undefined> {
    const emailSetting: any = await this.settingRepository.find({
      where: {key: 'email'},
    });
    const toAddresses = await (emailSetting[0].value.to || '').split(',');
    const email = new emailtemplate({
      message: {
        from: emailSetting[0].value.from,
      },
      transport: {
        jsonTransport: true,
      },
      preview: true,
    });
    if (payOrder.items) {
      return await email
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
        .then(async (emailtemplate: any) => {
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
            from: `"Bestellungen Schneckenhof" <${emailSetting[0].value.from}>`,
            to: emailSetting[0].value.to,
            cc: emailSetting[0].value.cc,
            subject: '✨New Wine Order',
            text: templates.text,
            html: templates.html,
          };

          const sendMessage = await transporter.sendMail(message);

          console.log(
            'New Order Email has been sent of messageId: %s',
            sendMessage.messageId,
          );

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
