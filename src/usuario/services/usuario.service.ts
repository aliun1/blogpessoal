import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Usuario } from '../entities/usuario.entity';
import { Bcrypt } from 'src/auth/bcrypt/bcrypt';
import { InjectRepository } from '@nestjs/typeorm';


@Injectable()
export class UsuarioService {
    constructor(
        @InjectRepository(Usuario)
        private usuarioRepository: Repository<Usuario>,
        private bcrypt: Bcrypt
    ) {}

    // 🔍 Buscar usuário pelo username (email)
    async findByUsuario(usuario: string): Promise<Usuario | null> {
        return this.usuarioRepository.findOne({
            where: {
                usuario: usuario
            }
        });
    }

    // 📋 Listar todos os usuários com postagens
    async findAll(): Promise<Usuario[]> {
        return this.usuarioRepository.find({
            relations: {
                postagem: true
            }
        });
    }

    // 🔍 Buscar usuário por ID
    async findById(id: number): Promise<Usuario> {

        const usuario = await this.usuarioRepository.findOne({
            where: {
                id: id
            }
        });

        if (!usuario)
            throw new HttpException(
                'Usuário não encontrado!',
                HttpStatus.NOT_FOUND
            );

        return usuario;
    }

    // ➕ Criar usuário
    async create(usuario: Usuario): Promise<Usuario> {

        const usuarioBusca = await this.findByUsuario(usuario.usuario);

        if (usuarioBusca)
            throw new HttpException(
                'O usuário já existe!',
                HttpStatus.BAD_REQUEST
            );

        usuario.senha = await this.bcrypt.criptografarSenha(usuario.senha);
        return this.usuarioRepository.save(usuario);
    }

    // ✏️ Atualizar usuário
    async update(usuario: Usuario): Promise<Usuario> {

        const usuarioUpdate = await this.findById(usuario.id);
        const usuarioBusca = await this.findByUsuario(usuario.usuario);

        if (usuarioBusca && usuarioBusca.id !== usuario.id)
            throw new HttpException(
                'Usuário (e-mail) já cadastrado!',
                HttpStatus.BAD_REQUEST
            );

        usuario.senha = await this.bcrypt.criptografarSenha(usuario.senha);
        return this.usuarioRepository.save(usuario);
    }
}
