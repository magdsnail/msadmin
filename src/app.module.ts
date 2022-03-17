import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
// import { TypegooseModule } from "nestjs-typegoose";
import appConfig from './config/index';

import { DepartmentModule } from './department/department.module';
import { RoleModule } from './role/role.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { JobModule } from './job/job.module';
import { MongooseModule } from '@nestjs/mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2'
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { MenuModule } from './menu/menu.module';
import { RolesGuard } from './guard/roles.guard';
import { DynamicModule } from './dynamic/dynamic.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: appConfig
		}),
		MongooseModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: (configService: ConfigService) => ({
				uri: configService.get<string>('mongoConfig.uri')
				// useNewUrlParser: true,
				// useUnifiedTopology: true,
				// useCreateIndex: true,
				// versionKey: false,
				// connectionFactory: async(connection) => {
				// 	connection.plugin(mongoosePaginate);
				// 	return connection;
				// }
			}),
			inject: [ConfigService]
		}),
		DepartmentModule,
		RoleModule,
		UserModule,
		AuthModule,
		JobModule,
		MenuModule,
		DynamicModule
	],
	controllers: [AppController],
	providers: [AppService,
		{
			provide: APP_GUARD,//token
			useClass: JwtAuthGuard,
		},
		{
			provide: APP_GUARD,//roles
			useClass: RolesGuard,
		}
	],
})
export class AppModule { }
