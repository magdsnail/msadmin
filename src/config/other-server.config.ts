import { registerAs } from '@nestjs/config'

export default registerAs('otherServer', () => ({
  baseUrl: process.env.OTHER_SERVER,
  timeout: 30000,
  path: {
    config: 'config'
  }
}));