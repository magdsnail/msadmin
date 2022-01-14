import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
// import { TypegooseModule } from 'nestjs-typegoose';
import { Department, DepartmentSchema } from '../schemas/sys/department';
import { DepartmentController } from './department.controller';
import { DepartmentService } from './department.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Department.name, schema: DepartmentSchema }])
  ],
  controllers: [DepartmentController],
  providers: [DepartmentService],
  exports: [DepartmentService]
})

export class DepartmentModule { }
