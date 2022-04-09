import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { REOEATSUBMIT_METADATA } from '../decorator/constant';
import { RepeatSubmitOption } from '../decorator/repeat-submit.decorator';
import { Request } from 'express'
import { ApiException } from '../exceptions/api.exception';
import { RedisService } from '../dynamic/redis/redis.service';

@Injectable()
export class RepeatSubmitGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly redisService: RedisService,
  ) { }
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const repeatSubmitOption: RepeatSubmitOption = this.reflector.get(REOEATSUBMIT_METADATA, context.getHandler())
    if (!repeatSubmitOption) return true

    const request: Request = context.switchToHttp().getRequest()
    const cache = await this.redisService.getRedis('admin').get(request.url);
    const data = { body: request.body, prams: request.params, query: request.query }
    const dataString = JSON.stringify(data)
    if (!cache) {//没有缓存数据
      if (dataString) {
        await this.redisService.getRedis('admin').set(request.url, dataString, 'EX', repeatSubmitOption.interval)
      }
    } else {
      if (dataString && cache === dataString) {
        throw new ApiException(repeatSubmitOption.message)
      }
    }
    return true
  }
}
