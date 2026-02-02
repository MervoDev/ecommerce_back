import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { UserRole } from '../users/users.entity';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { userEmail } = request.body;
    
    if (!userEmail) {
      throw new UnauthorizedException('Email utilisateur requis');
    }

    const user = await this.usersService.findByEmail(userEmail);
    
    if (!user || user.role !== UserRole.ADMIN) {
      throw new UnauthorizedException('Droits administrateur requis');
    }

    request.user = user;
    return true;
  }
}