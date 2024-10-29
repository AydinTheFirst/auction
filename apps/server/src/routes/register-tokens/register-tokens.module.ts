import { Module } from '@nestjs/common';

import { RegisterTokensController } from './register-tokens.controller';
import { RegisterTokensService } from './register-tokens.service';

@Module({
  controllers: [RegisterTokensController],
  providers: [RegisterTokensService],
})
export class RegisterTokensModule {}
