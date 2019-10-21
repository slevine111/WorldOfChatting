import { CacheModule, CacheModuleOptions } from '@nestjs/common'
import { Module, Global } from '@nestjs/common'
import RedisStore from 'cache-manager-redis-store'

const cacheStore: CacheModuleOptions = {
  store: RedisStore,
  host: process.env.REDIS_SERVICE_SERVICE_HOST
}
@Global()
@Module({
  imports: [CacheModule.register({ cacheStore, ttl: undefined })],
  exports: [CacheModule.register({ cacheStore, ttl: undefined })]
})
export default class MyCahceModule {}
