import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RequestModule } from './request/request.module';
import { RequestService } from './request/request.service';

/**
 * 全局共享模块
 */
@Global()
@Module({
    imports: [
        RequestModule.registerAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ([
                {
                    timeout: configService.get<number>('otherServer.timeout'),
                    baseURL: configService.get<string>('otherServer.baseURL')
                }
            ]),
            inject: [ConfigService]
        })
    ],
    providers: [RequestService],
    exports: [RequestService]
})
export class DynamicModule { }
