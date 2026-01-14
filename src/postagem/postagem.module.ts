import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Postagem } from './entities/postagem.entity';
import { PostagemService } from './services/postagem.service'


import { PostagemController } from './controller/postagem.controller';
import { TemaModule } from 'src/tema/tema.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Postagem]),
    TemaModule,  
  ],
  controllers: [PostagemController],
  providers: [PostagemService],
  exports: [PostagemService],
})
export class PostagemModule {}