import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Bcrypt } from "../bcrypt/bcrypt";
import { JwtService } from "@nestjs/jwt";
import { UsuarioService } from "src/usuario/services/usuario.service";
import { UsuarioLogin } from "../entities/usuariologin.entity";

@Injectable()
export class AuthService {
    constructor(
        private usuarioService: UsuarioService,
        private jwtService: JwtService,
        private bcrypt: Bcrypt
    ) {}

    async validateUser(username: string, password: string): Promise<any> {

        const buscaUsuario = await this.usuarioService.findByUsuario(username);

        if (!buscaUsuario)
            throw new HttpException('Usuário não encontrado!', HttpStatus.NOT_FOUND);

        const matchPassword = await this.bcrypt.compararSenhas(
            buscaUsuario.senha,
            password
        );

        if (!matchPassword)
            throw new HttpException('Senha inválida!', HttpStatus.UNAUTHORIZED);

        const { senha, ...resposta } = buscaUsuario;
        return resposta;
    }

    async login(usuarioLogin: UsuarioLogin) {

        const buscaUsuario = await this.usuarioService.findByUsuario(
            usuarioLogin.usuario
        );

        if (!buscaUsuario)
            throw new HttpException('Usuário não encontrado!', HttpStatus.NOT_FOUND);

        const payload = {
            sub: buscaUsuario.id,
            usuario: buscaUsuario.usuario
        };

        return {
            id: buscaUsuario.id,
            nome: buscaUsuario.nome,
            usuario: buscaUsuario.usuario,
            senha: '',
            foto: buscaUsuario.foto,
            token: `Bearer ${this.jwtService.sign(payload)}`,
        };
    }
}
