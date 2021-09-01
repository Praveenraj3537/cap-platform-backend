import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags, ApiResponseProperty} from '@nestjs/swagger';

@ApiTags('AppController')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiResponseProperty()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
