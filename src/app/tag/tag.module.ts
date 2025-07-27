import { Module } from '@nestjs/common';
import { TagService } from './tag.service';
import { TagController } from './tag.controller';
import { ClsModule } from 'nestjs-cls';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [ClsModule, AuthModule],
  controllers: [TagController],
  providers: [TagService],
})
export class TagModule {}
