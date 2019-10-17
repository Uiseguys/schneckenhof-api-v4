import {Provider, inject, ValueOrPromise, Getter} from '@loopback/context';
import {Strategy} from 'passport';
import {
  AuthenticationBindings,
  AuthenticationMetadata,
} from '@loopback/authentication';
import {UserProfile} from '@loopback/security';
import {BasicStrategy} from 'passport-http';
import {CustomUserRepository} from '../repositories';
import {repository} from '@loopback/repository';
const bcrypt = require('bcrypt');

export class MyAuthStrategyProvider implements Provider<Strategy | undefined> {
  constructor(
    @inject(AuthenticationBindings.METADATA)
    private metadata: AuthenticationMetadata,
    @repository(CustomUserRepository)
    protected userRepository: CustomUserRepository,
  ) {}

  value(): ValueOrPromise<Strategy | undefined> {
    // The function was not decorated, so we shouldn't attempt authentication
    if (!this.metadata) {
      return undefined;
    }

    const name = this.metadata.strategy;
    if (name === 'BasicStrategy') {
      return new BasicStrategy(this.verify.bind(this));
    } else {
      return Promise.reject(`The strategy ${name} is not available.`);
    }
  }

  verify(
    username: string,
    password: string,
    cb: (err: Error | null, user?: any | false) => void,
  ) {
    this.userRepository.findOne({where: {email: username}}, function(
      err: any,
      user: any,
    ) {
      if (user) {
        bcrypt.compare(password, user.password, function(err: any, match: any) {
          if (match) {
            cb(null, {id: user.id});
          } else {
            cb(null, false);
          }
        });
      } else {
        cb(null, false);
      }
    });
  }
}
