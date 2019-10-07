import { CacheModule } from '@nestjs/common'
import { Module, Global } from '@nestjs/common'
import RedisStore from 'cache-manager-redis-store'

@Global()
@Module({
  imports: [CacheModule.register({ store: RedisStore, ttl: undefined })],
  exports: [CacheModule.register({ store: RedisStore, ttl: undefined })]
})
export default class MyCahceModule {}
