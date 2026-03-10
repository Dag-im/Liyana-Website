import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { JWT_COOKIE_NAME } from '../../../common/constants/app.constants';
import { UserRole } from '../../../common/types/user-role.enum';

type JwtPayload = {
  sub: string;
  role: UserRole;
  divisionId: string | null;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (
          request: { signedCookies?: Record<string, string> } | undefined,
        ): string | null => {
          if (!request?.signedCookies?.[JWT_COOKIE_NAME]) {
            return null;
          }
          return request.signedCookies[JWT_COOKIE_NAME];
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('app.jwt.secret'),
    });
  }

  validate(payload: JwtPayload): JwtPayload {
    if (!payload?.sub || !payload?.role) {
      throw new UnauthorizedException('Invalid authentication token.');
    }

    return payload;
  }
}
