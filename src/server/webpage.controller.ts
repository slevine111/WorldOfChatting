import { join } from 'path'
import { Controller, Get, Res } from '@nestjs/common'
import { Response } from 'express'

@Controller('')
export default class WebpageController {
  @Get()
  index(@Res() res: Response): void {
    res.sendFile(join(__dirname, '..', '..', 'index.html'))
  }
}
