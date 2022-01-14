import { Module } from '@nestjs/common';
import { JobService } from './job.service';
import { JobController } from './job.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Job, JobSchema } from '../schemas/sys/job';
import * as mongoosePaginate from 'mongoose-paginate-v2'

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Job.name,
        useFactory: () => {
          const schema = JobSchema;
          schema.plugin(mongoosePaginate);
          return schema;
        },
      },
    ]),
  ],
  providers: [JobService],
  controllers: [JobController],
  exports: [JobService]
})
export class JobModule { }
