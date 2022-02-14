import mongoConfig from './mongo.config'
import jwtConfig from './jwt'
import swagger from './swagger'
import otherServer from './other-server.config'
import redisConfig from './redis.config'

const appConfig = [mongoConfig, jwtConfig, swagger, otherServer, redisConfig];

export default appConfig