import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../entities/usuario.entity';
import { Bcrypt } from 'src/auth/bcrypt/bcrypt';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
    private bcrypt: Bcrypt,
  ) {}
  async findByUsuario(usuario: string): Promise<Usuario | null> {
    return await this.usuarioRepository.findOne({
      where: { usuario },
    });
  }
  async findAll(): Promise<Usuario[]> {
    return await this.usuarioRepository.find();
  }
  async findById(id: number): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOne({
      where: { id },
    });
    if (!usuario) {
      throw new HttpException('Usuário não encontrado!', HttpStatus.NOT_FOUND);
    }
    return usuario;
  }
  async create(usuario: Usuario): Promise<Usuario> {
    const usuarioBusca = await this.findByUsuario(usuario.usuario);

    if (usuarioBusca) {
      throw new HttpException('O Usuário já existe!', HttpStatus.BAD_REQUEST);
    }
    usuario.senha = await this.bcrypt.criptografarSenha(usuario.senha);
    return await this.usuarioRepository.save(usuario);
  }
  async update(usuario: Usuario): Promise<Usuario> {
    await this.findById(usuario.id);
    return await this.usuarioRepository.save(usuario);
  }
}
