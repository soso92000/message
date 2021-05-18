
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InMemoryDBService } from '@nestjs-addons/in-memory-db';
import { JwtEntity} from '../entity/jwt.entity';
import { AuthentificationService } from '../services/authentification.service';
import { UsersService } from 'src/users/services/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly jwtEntityService: InMemoryDBService<JwtEntity>, private userService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'secret', // mettre une variable d'env
    });
  }

  async validate(payload: any) {
    const jwtUser = await this.jwtEntityService.get(payload.sub.toString());
    if (!jwtUser) {
      throw new UnauthorizedException();
    }
    return this.userService.findOne(payload.sub);
  }
}
