import { DynamicModule, Module, OnModuleDestroy, Provider } from '@nestjs/common';
import axios, { Axios, AxiosInstance } from 'axios';
import { RequestService } from './request.service';
import { AxiosModuleAsyncOptions, AxiosModuleOptions } from './request.interface'
import { REQUEST_CLIENT, REQUEST_MODULE_OPTIONS, REQUEST_DEFAULT_CLIENT_KEY } from './constants';

@Module({})
export class RequestModule {
	static register(
		options: AxiosModuleOptions | AxiosModuleOptions[],
	): DynamicModule {
		const clientProvider = this.createAysncProvider();
		return {
			module: RequestModule,
			providers: [
				clientProvider,
				{
					provide: REQUEST_MODULE_OPTIONS,
					useValue: options,
				},
			],
			exports: [clientProvider],
		};
	}

	static registerAsync(options: AxiosModuleAsyncOptions): DynamicModule {
		const clientProvider = this.createAysncProvider();
		return {
			module: RequestModule,
			imports: options.imports ?? [],
			providers: [clientProvider, this.createAsyncClientOptions(options)],
			exports: [clientProvider],
		};
	}

	private static createAsyncClientOptions(options: AxiosModuleAsyncOptions) {
		return {
			provide: REQUEST_MODULE_OPTIONS,
			useFactory: options.useFactory,
			inject: options.inject,
		};
	}

	private static createAysncProvider(): Provider {
		return {
			provide: REQUEST_CLIENT,
			useFactory: (
				options: AxiosModuleOptions | AxiosModuleOptions[],
			): Map<string, Axios | AxiosInstance> => {
				const clients = new Map<string, Axios | AxiosInstance>();
				if (!Array.isArray(options)) {
					clients.set(REQUEST_DEFAULT_CLIENT_KEY, this.init(options));
				} else {
					options.forEach(op => {
						const name = op.name ?? REQUEST_DEFAULT_CLIENT_KEY;
						if (clients.has(name)) {
							throw new Error('Axios Init Error: name must unique');
						}
						clients.set(name, this.init(op));
					})
				}
				return clients;
			},
			inject: [REQUEST_MODULE_OPTIONS],
		};
	}

	/**
	 * 创建实例
	 */
	private static init(options: AxiosModuleOptions): Axios | AxiosInstance {
		const client = axios.create({
			baseURL: options.baseURL,
			timeout: options.timeout,
			headers: options.headers ?? {
				'Content-Type': 'application/json;charset=utf-8'
			}
		});
		// client.interceptors.request.use(function (config) {
		//     // Do something before request is sent         
		//     // const token = store.state.user.userInfo.token;
		//     // config.headers.Authorization = token;
		//     // delete config.data.time;         
		//     return config;
		// }, function (error) {
		//     // Do something with request error
		//     return Promise.reject(error);
		// });

		// // Add a response interceptor
		// client.interceptors.response.use(function (response) {
		//     // Do something with response data
		//     return response;
		// }, function (error) {
		//     return Promise.reject(error);
		// });
		return client;
	}


}
