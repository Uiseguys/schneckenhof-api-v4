import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getFilterSchemaFor,
  getModelSchemaRef,
  getWhereSchemaFor,
  patch,
  put,
  del,
  requestBody,
  Request,
  Response,
  RestBindings,
} from '@loopback/rest';
import {inject} from '@loopback/context';
import {Payment, Order} from '../models';
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
    payment: object,
    @inject(RestBindings.Http.REQUEST) request: Request,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ): Promise<object> {
    return new Promise<object>((resolve, reject) => {
      const self = this;
      const reqBody = request.body as any;
      if (request.body != null) {
        this.orderRepository.create(
          {
            type: 'email',
            email: reqBody.email,
            total: reqBody.total,
            details: reqBody,
          } as Order,
          (err: any, res: any) => {
            if (err) {
              reject(err);
            } else {
              self.settingRepository.find({where: {key: 'email'}}, function(
                err: any,
                settingInstance: any,
              ) {
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
                      realname: reqBody.realname,
                      items: reqBody.items,
                      email: reqBody.email,
                      street: reqBody.street,
                      zip: reqBody.zip,
                      city: reqBody.city,
                      phone: reqBody.phone,
                      message: reqBody.message,
                    },
                  })
                  .then(function(emailtemplate: any) {
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

                    transporter.sendMail(message, function(error) {
                      if (error) {
                        console.log('Error occured');
                        console.log(error.message);
                        return;
                      }
                      resolve({
                        email: 'Email is sent',
                        href: '/danke',
                      });
                    });
                  });
              });
            }
          },
        );
      }
    });
  }
}
