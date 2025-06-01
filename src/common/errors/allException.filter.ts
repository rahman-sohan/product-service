import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpStatus,
    BadRequestException,
    Logger,
    NotFoundException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    private readonly logger = new Logger(AllExceptionsFilter.name);

    catch(exception: any, host: ArgumentsHost) {
        this.logger.error('An unhandled exception occurred:', exception.message || exception);
        const ctx = host.switchToHttp();
        const request = ctx.getRequest<Request>();
        const response = ctx.getResponse<Response>();

        if (exception instanceof BadRequestException) {
            return response.status(HttpStatus.BAD_REQUEST).json({
                code: 'E_BAD_REQUEST',
                message: 'Bad Request',
                errors: (exception.getResponse() as any).message,
            });
        }

        if (exception instanceof NotFoundException) {
            return response.status(HttpStatus.NOT_FOUND).json({
                code: 'E_NOT_FOUND',
                message: 'Not found',
                errors: [(exception.getResponse() as any).message],
            });
        }

        if (exception.status === HttpStatus.UNAUTHORIZED) {
            return response.status(HttpStatus.UNAUTHORIZED).json({
                code: 'E_UNAUTHORIZED',
                message: 'Unauthorized',
                errors: [(exception.getResponse() as any).message],
            });
        }

        return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Internal Server Error',
            errors: [],
        });
    }
}
