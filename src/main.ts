import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

import * as helmet from 'helmet'
// import * as rateLimit from 'express-rate-limit';
import * as express from 'express'
import { logger } from './middleware/logger.middleware';
import { ValidationPipe } from '@nestjs/common';

import { TransformInterceptor } from './interceptor/transform.interceptor';
import { Logger } from './utils/log4js';
import { AllExceptionsFilter } from './filter/any-exception.filter';
import { HttpExceptionFilter } from './filter/http-exception.filter';
import { EnvSwaggerOptions } from './config/swagger';
import { ConfigService } from '@nestjs/config';

const PORT = process.env.PORT || 7002;
const PREFIX = process.env.PREFIX || '/';
const IS_DEV = process.env.NODE_ENV !== 'production';

async function bootstrap() {
	Logger.info(IS_DEV, '是否为开发环境');
	const app = await NestFactory.create(AppModule, {
		cors: true
	});

	//配置日志信息
	app.use(express.json()); // For parsing application/json
	app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
	// app.use(myLogger.use);
	app.use(logger);

	// 使用全局拦截器打印出参
	app.useGlobalInterceptors(new TransformInterceptor());

	// 过滤处理 所有 异常
	// app.useGlobalFilters(new AllExceptionsFilter());
	// 过滤处理 HTTP 异常
	app.useGlobalFilters(new HttpExceptionFilter());

	// Web漏洞的
	// app.use(helmet());

	// 注册并配置全局验证管道
	app.useGlobalPipes(new ValidationPipe())

	app.setGlobalPrefix(PREFIX);

	//设置swagger文档
	if (IS_DEV) {
		const configService = app.get(ConfigService);
		const swaggerOptions = configService.get<EnvSwaggerOptions>('EnvSwaggerOption');
		const options = new DocumentBuilder()
			.setTitle(swaggerOptions.title)
			.setDescription(swaggerOptions.desc)
			.setVersion(swaggerOptions.version)
			.addBearerAuth()
			.build();
		const document = SwaggerModule.createDocument(app, options, {
			ignoreGlobalPrefix: false
		});
		SwaggerModule.setup(swaggerOptions.setupUrl, app, document, {
			swaggerOptions: {
				persistAuthorization: true
			}
		});
	}
	await app.listen(PORT);

	Logger.info(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();