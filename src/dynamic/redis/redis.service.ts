import { Inject, Injectable } from '@nestjs/common';
import { Cluster } from 'cluster';
import { Redis } from 'ioredis';
import { REDIS_CLIENT, REDIS_DEFAULT_CLIENT_KEY } from './constants';

@Injectable()
export class RedisService {
    constructor(
        @Inject(REDIS_CLIENT)
        private readonly clients: Map<string, Redis | Cluster>,
    ) { }

    /**
     * get redis client by name
     * @param name 
     * @returns redis instance
     */
    public getRedis(name = REDIS_DEFAULT_CLIENT_KEY): Redis {
        if (!this.clients.has(name)) {
            throw new Error(`redis client ${name} does not exist`);
        }
        return this.clients.get(name) as Redis;
    }

}

//使用
// import { RedisService } from '../redis.service';
// await this.redisService
// .getRedis()
// .set(xx, xx)
