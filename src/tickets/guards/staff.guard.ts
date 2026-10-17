import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class StaffGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const staffKey = request.headers['x-staff-key'];

    if (staffKey !== 'helpDesk-staff-secret') {
      throw new ForbiddenException('Staff access required');
    }

    return true;
  }
}
