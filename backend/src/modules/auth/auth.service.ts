import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Response } from 'express';

import { JWT_COOKIE_NAME } from '../../common/constants/app.constants';
import { AuditAction } from '../../common/enums/audit-action.enum';
import { AuditLogService } from '../../common/services/audit-log.service';
import { UserRole } from '../../common/types/user-role.enum';
import { User } from '../users/entity/user.entity';
import { UsersService } from '../users/users.service';

type JwtPayload = {
  sub: string;
  role: UserRole;
  divisionId: string | null;
};

type AuthenticatedRequest = {
  user: JwtPayload;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly auditLogService: AuditLogService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findByEmail(email);

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    return user;
  }

  async login(user: User, response: Response): Promise<User> {
    const payload: JwtPayload = {
      sub: user.id,
      role: user.role,
      divisionId: user.divisionId,
    };

    const token = await this.jwtService.signAsync(payload);

    const cookieOptions = this.configService.getOrThrow<{
      httpOnly: boolean;
      secure: boolean;
      sameSite: 'strict' | 'lax' | 'none';
      maxAge: number;
    }>('app.jwt.cookie');

    response.cookie(JWT_COOKIE_NAME, token, {
      ...cookieOptions,
      signed: true,
    });

    this.auditLogService.log(AuditAction.USER_LOGIN, user.id, user.id);

    return user;
  }

  logout(
    request: AuthenticatedRequest,
    response: Response,
  ): { message: string } {
    const cookieOptions = this.configService.getOrThrow<{
      httpOnly: boolean;
      secure: boolean;
      sameSite: 'strict' | 'lax' | 'none';
    }>('app.jwt.cookie');

    response.clearCookie(JWT_COOKIE_NAME, {
      httpOnly: cookieOptions.httpOnly,
      secure: cookieOptions.secure,
      sameSite: cookieOptions.sameSite,
      signed: true,
    });

    this.auditLogService.log(
      AuditAction.USER_LOGOUT,
      request.user.sub,
      request.user.sub,
    );

    return { message: 'Logged out' };
  }

  async me(request: AuthenticatedRequest): Promise<User> {
    return this.usersService.findOne(request.user.sub);
  }
}
