import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScheduleModule } from '@nestjs/schedule';
import { GenDataService } from './services/gendata.cron.service';
import { MongooseModule } from '@nestjs/mongoose';
import { IndicesModule } from './schemas/Indice/indices.module';

@Module({
  imports: [ScheduleModule.forRoot(), MongooseModule.forRoot('mongodb://mongo:27017/indices'), IndicesModule],
  controllers: [AppController],
  providers: [AppService, GenDataService],
})
export class AppModule {}
