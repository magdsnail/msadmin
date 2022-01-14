import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

/**
 * 验证token
 * 暂不使用
 */

// @Injectable()
// export class AuthGuard implements CanActivate {
//   canActivate(
//     context: ExecutionContext,
//   ): boolean | Promise<boolean> | Observable<boolean> {
//     const request = context.switchToHttp().getRequest();
//     // return validateRequest(request);
//     return true;
//     // 如果返回 true, 将处理用户调用。
//     // 如果返回 false, 则 Nest 将忽略当前处理的请求

//   }
// }
// import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
// import { Reflector } from "@nestjs/core";

// @Injectable()
// export class AuthGuard implements CanActivate {
// 	public constructor( private readonly reflector: Reflector ) {
// 	}

// 	public canActivate( context: ExecutionContext ): boolean {
// 		const isPublic = this.reflector.get<boolean>( "isPublic", context.getHandler() );

// 		if ( isPublic ) {
// 			return true;
// 		}

// 		// Make sure to check the authorization, for now, just return false to have a difference between public routes.
// 		return false;
// 	}
// }
// This guard is then added globally to all the routes using the following in main.ts:

// const reflector = app.get( Reflector );
// app.useGlobalGuards( new AuthGuard( reflector ) );

// @Public()
// @Get()
// public getHello(): string {
//    return this.appService.getHello();
// }