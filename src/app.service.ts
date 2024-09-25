import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor() {
    Logger.log(process.env.GEMPRESA_RUN_ENV);
  }
  getHello(): string {
    return 'Hello World!';
  }
}
