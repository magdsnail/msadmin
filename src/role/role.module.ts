import { forwardRef, Module } from '@nestjs/common';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { Role, RoleSchema } from '../schemas/sys/role';
import { MongooseModule } from '@nestjs/mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2'
import { MenuModule } from '../menu/menu.module';
import { DepartmentModule } from '../department/department.module';

@Module({
	imports: [
		MongooseModule.forFeatureAsync([
			{
				name: Role.name,
				useFactory: () => {
					const schema = RoleSchema;
					schema.plugin(mongoosePaginate);
					return schema;
				},
			}
		]),
		forwardRef(() => MenuModule),
		forwardRef(() => DepartmentModule)
	],
	controllers: [RoleController],
	providers: [RoleService],
	exports: [RoleService]
})
export class RoleModule { }
