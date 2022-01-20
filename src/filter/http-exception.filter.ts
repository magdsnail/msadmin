import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { classToPlain, plainToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { rmSync } from 'fs';
import { Logger } from '../utils/log4js';

@Catch()
export class HttpExceptionFilter<T> implements ExceptionFilter {
	catch(exception: HttpException, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const request = ctx.getRequest<Request>();
		const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
		let customCode = status;
		let customMsg: string;
		if (exception instanceof HttpException) {
			const response = exception.getResponse();
			const message = (response as any).message ?? response;
			if (Array.isArray(message)) {
				customMsg = message[0]
			} else {
				customMsg = exception.message;
			}
		} else {
			customMsg = `${exception}`
		}
		try {
			const { code, message } = JSON.parse(exception.message);
			customCode = code;
			customMsg = message;
		} catch (error) {
			console.log(error);
		}

		const logFormat = ` <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	  Request original url: ${request.originalUrl}
	  Method: ${request.method}
	  IP: ${request.ip}
	  Status code: ${status}
	  Response: ${exception.toString()} \n  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	  `;
		Logger.info(logFormat);
		response.status(status).json({
			code: customCode ?? status,
			msg: customMsg,
			err: `${status >= 500 ? 'Service Error' : 'Client Error'}`,
		});
	}


	// catch(exception: HttpException, host: ArgumentsHost) {
	// 	const ctx = host.switchToHttp();
	// 	const response = ctx.getResponse();
	// 	const request = ctx.getRequest();
	// 	const status =
	// 		exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
	// 	let resultMessage = exception.message;
	// 	// let resultCode = 1;
	// 	let resultParams = {};
	// 	try {
	// 		const { code, message, ...oth } = JSON.parse(exception.message);
	// 		resultMessage = message;
	// 		// resultCode = code;
	// 		resultParams = oth;
	// 	} catch (e) { }
	// 	// const message = exception.message;
	// 	Logger.error(exception, '错误提示');
	// 	const errorResponse = {
	// 		msg: resultMessage,
	// 		code: status,
	// 		params: resultParams,
	// 		path: request.url, // 错误的url地址
	// 		method: request.method, // 请求方式
	// 		timestamp: new Date(), // 错误的时间
	// 	};
	// 	// 打印日志
	// 	Logger.error(
	// 		`${request.method} ${request.url}`,
	// 		JSON.stringify(errorResponse),
	// 		'HttpExceptionFilter',
	// 	);
	// 	// 设置返回的状态码、请求头、发送错误信息
	// 	response.status(status);
	// 	response.header('Content-Type', 'application/json; charset=utf-8');
	// 	response.send({
	// 		code: status,
	// 		msg: `${status >= 500 ? 'Service Error' : 'Client Error'}`
	// 	});
	// }
}
