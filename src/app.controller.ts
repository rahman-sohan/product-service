import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get('/health-check')
    healthCheck(): any {
        return {
            status: 'ok',
            message: 'Auth Service is Up and Running!',
        };
    }
}
