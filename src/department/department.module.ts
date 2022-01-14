import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
// import { TypegooseModule } from 'nestjs-typegoose';
import { Department, DepartmentSchema } from '../schemas/sys/department';
import { DepartmentController } from './department.controller';
import { DepartmentService } from './department.service';
import * as mongoosePaginate from 'mongoose-paginate-v2'

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Department.name,
        useFactory: () => {
          const schema = DepartmentSchema;
          schema.plugin(mongoosePaginate);
          return schema;
        },
      },
    ]),
  ],
  controllers: [DepartmentController],
  providers: [DepartmentService],
  exports: [DepartmentService]
})

export class DepartmentModule { }
