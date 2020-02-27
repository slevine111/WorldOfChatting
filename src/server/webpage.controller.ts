import { join } from 'path'
import { Controller, Get, Res } from '@nestjs/common'
import { FastifyReply } from 'fastify'
import fs, { ReadStream } from 'fs'

@Controller('')
export default class WebpageController {
  @Get()
  index(@Res() res: FastifyReply<ReadStream>): void {
    const stream: ReadStream = fs.createReadStream(
      join(__dirname, '..', '..', 'index.html')
    )
    res.type('text/html').send(stream)
  }
}
