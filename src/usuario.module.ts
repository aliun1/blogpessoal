import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioService } from './usuario/services/usuario.service';
import { UsuarioController } from './usuario/controller/usuario.controller';
import { Usuario } from './usuario/entities/usuario.entity';
import { AuthModule } from './auth/entities/auth.module';

@Module({
    imports: [TypeOrmModule.forFeature([Usuario]), forwardRef(() => AuthModule)],
    providers: [UsuarioService],
    controllers: [UsuarioController],
    exports: [UsuarioService],
})
export class UsuarioModule { }