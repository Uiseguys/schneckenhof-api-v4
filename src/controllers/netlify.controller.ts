import {post, requestBody} from '@loopback/rest';
//import {inject} from '@loopback/context';
//import {Setting} from '../models';
//import {AuthenticationBindings, authenticate} from '@loopback/authentication';
//import {UserProfile} from '@loopback/security';

export class NetlifyController {
  private netlifyBuildStatus: string | null;

  constructor() //@inject(AuthenticationBindings.CURRENT_USER, {optional: true})
  //private user: UserProfile,
  {}

  //@authenticate('BasicStrategy')
  @post('/netlify/success', {
    responses: {
      '200': {
        description: 'Settings model instance',
        content: {'application/json': {schema: {type: 'object'}}},
      },
    },
  })
  async successBuild(
    @requestBody({
      content: {
        'application/json': {
          schema: {type: 'object'},
        },
      },
    })
    success: object,
  ): Promise<object> {
    console.log(success);
    this.netlifyBuildStatus = 'success';
    return {
      status: this.netlifyBuildStatus,
    };
  }

  @post('/netlify/fail', {
    responses: {
      '200': {
        description: 'Settings model instance',
        content: {'application/json': {schema: {type: 'object'}}},
      },
    },
  })
  async failedBuild(
    @requestBody({
      content: {
        'application/json': {
          schema: {type: 'object'},
        },
      },
    })
    fail: object,
  ): Promise<object> {
    console.log(fail);
    return {
      status: this.netlifyBuildStatus,
    };
  }
}
