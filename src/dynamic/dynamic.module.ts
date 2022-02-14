import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisModule } from './redis/redis.module';
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
        }),
        RedisModule.registerAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ([
                {
                    name: 'admin',
                    host: configService.get<string>('redisConfig.host'),
                    port: configService.get<number>('redisConfig.port'),
                    password: configService.get<string>('redisConfig.password'),
                    db: configService.get<number>('redisConfig.dbadmin')
                },
                {
                    name: 'game',
                    host: configService.get<string>('redisConfig.host'),
                    port: configService.get<number>('redisConfig.port'),
                    password: configService.get<string>('redisConfig.password'),
                    db: configService.get<number>('redisConfig.dbgame')
                }
            ]),
            inject: [ConfigService]
        })
    ],
    providers: [RequestService],
    exports: [RequestService]
})
export class DynamicModule { }
