import { CacheModule, CacheModuleOptions } from '@nestjs/common'
import { Module, Global } from '@nestjs/common'
import RedisStore from 'cache-manager-redis-store'
import { config } from 'dotenv'

if (process.env.LOAD_CONFIG_FILE === 'true') {
  config()
}

const cacheStoreConfig: CacheModuleOptions = {
  store: RedisStore,
  host: process.env.REDIS_SERVICE_SERVICE_HOST,
  port: process.env.REDIS_SERVICE_SERVICE_PORT,
  password: process.env.REDIS_PASSWORD
}
@Global()
@Module({
  imports: [CacheModule.register(cacheStoreConfig)],
  exports: [CacheModule.register(cacheStoreConfig)]
})
export default class MyCacheModule {}
