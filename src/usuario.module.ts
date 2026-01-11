import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioService } from './usuario/services/usuario.service';
import { Usuario } from './usuario/entities/usuario.entity';
import { UsuarioController } from './usuario/controller/usuario.controller';
import { AuthModule } from './auth/entities/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario]),
    AuthModule
  ],
  providers: [UsuarioService],
  controllers: [UsuarioController],
  exports: [UsuarioService],
})
export class UsuarioModule {}
