import { registerAs } from '@nestjs/config'

export default registerAs('redisConfig', () => ({
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        password: process.env.REDIS_PASSWORD,
        dbadmin: process.env.REDIS_ADMIN,
        dbgame: process.env.REDIS_GAME_SERVER
    }));