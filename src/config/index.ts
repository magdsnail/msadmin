import mongoConfig from './mongo.config'
import jwtConfig from './jwt'
import swagger from './swagger'
import otherServer from './other-server.config'

const appConfig = [mongoConfig, jwtConfig, swagger, otherServer];

export default appConfig