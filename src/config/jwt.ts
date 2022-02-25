import { registerAs } from '@nestjs/config'

export default registerAs('JWT', () => ({
  secretKey: process.env.JWT_SECRET_KEY || 'heluoyun_manage',
  expiresIn: process.env.JWT_EXPIRESIN || '24h',
  redisExpires: Number(process.env.JWT_REDISEXPIRES || 86400)
}));