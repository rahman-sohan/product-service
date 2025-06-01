import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
    Logger,
} from '@nestjs/common';
import { TokenPayload } from '../interfaces/auth.interface';
import { RabbitMQListenersService } from '../../message-broker-rabbitmq/rabbit-listeners.service';

@Injectable()
export class AuthGuard implements CanActivate {
    private readonly logger = new Logger(AuthGuard.name);

    constructor(private readonly rabbitMQListenersService: RabbitMQListenersService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            this.logger.warn('Missing or invalid Authorization header');
            throw new UnauthorizedException('Authorization token is missing');
        }

        const token = authHeader.split(' ')[1];

        try {
            const response = await this.rabbitMQListenersService.validateToken(token);

            if (!response?.isValid) {
                this.logger.warn('Token validation failed: ' + (response?.message || response?.error || 'Unknown reason'));
                throw new UnauthorizedException(response?.message || response?.error || 'Invalid token');
            }

            request.user = response.user as TokenPayload;
            return true;
        } catch (error) {
            this.logger.error(`Token validation error: ${error.message}`);
            throw new UnauthorizedException('Invalid or expired token');
        }
    }
}
