import { CacheModule } from '@nestjs/common'
import { Module, Global } from '@nestjs/common'

@Global()
@Module({
  imports: [CacheModule.register()],
  exports: [CacheModule.register()]
})
export default class MyCahceModule {}
