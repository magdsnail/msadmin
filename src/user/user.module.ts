import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JobModule } from '../job/job.module';
import { AuthModule } from '../auth/auth.module';
import { RoleModule } from '../role/role.module';
import { MenuModule } from '../menu/menu.module';
import { User, UserSchema } from '../schemas/sys/user';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { DepartmentModule } from '../department/department.module';
import * as mongoosePaginate from 'mongoose-paginate-v2'

@Module({
	imports: [
		MongooseModule.forFeatureAsync([
			{
				name: User.name,
				useFactory: () => {
					const schema = UserSchema;
					schema.plugin(mongoosePaginate);
					return schema;
				},
			}
		]),
		forwardRef(() => AuthModule),
		forwardRef(() => JobModule),
		forwardRef(() => RoleModule),
		forwardRef(() => DepartmentModule),
		forwardRef(() => MenuModule)
	],
	controllers: [UserController],
	providers: [UserService],
	exports: [UserService]
})
export class UserModule { }
