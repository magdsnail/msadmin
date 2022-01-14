import mongoConfig from './mongo.config'
import jwtConfig from './jwt'
import swagger from './swagger'

const appConfig = [mongoConfig, jwtConfig, swagger];

export default appConfig