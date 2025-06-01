import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
    Logger,
} from '@nestjs/common';
import { TokenPayload } from '../interfaces/auth.interface';
import { MessageBrokerRabbitmqService } from '../../message-broker-rabbitmq/message-broker-rabbitmq.service';
import { MessagePatterns } from '../constants/message-patterns';

@Injectable()
export class AuthGuard implements CanActivate {
    private readonly logger = new Logger(AuthGuard.name);

    constructor(private readonly messageBroker: MessageBrokerRabbitmqService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            this.logger.warn('Missing or invalid Authorization header');
            throw new UnauthorizedException('Authorization token is missing');
        }

        const token = authHeader.split(' ')[1];

        try {
            const response = await this.messageBroker.publishToAuthExchange({
                pattern: MessagePatterns.VALIDATE_USER_TOKEN,
                data: { token },
            });

            if (!response?.isValid) {
                this.logger.warn('Token validation failed');
                throw new UnauthorizedException('Invalid token');
            }

            request.user = response.user as TokenPayload;
            return true;
        } catch (error) {
            this.logger.error(`Token validation error: ${error.message}`);
            throw new UnauthorizedException('Invalid or expired token');
        }
    }
}
