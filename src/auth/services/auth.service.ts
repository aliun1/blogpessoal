import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuarioService } from './../../usuario/services/usuario.service';
import { Bcrypt } from '../bcrypt/bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usuarioService: UsuarioService,
    private jwtService: JwtService,
    private bcrypt: Bcrypt,
  ) {}

  // usado pelo LocalStrategy
  async validateUser(username: string, password: string): Promise<any> {
    const usuario = await this.usuarioService.findByUsuario(username);

    if (!usuario) {
      return null;
    }
    const senhaValida = await this.bcrypt.compararSenhas(
      password,
      usuario.senha,
    );

    if (!senhaValida) {
      return null;
    }

    const { senha, ...usuarioSemSenha } = usuario;
    return usuarioSemSenha;
  }
  // gera o token (usuario já vem autenticado)
  async login(usuario: any) {
    const payload = { sub: usuario.usuario };

    return {
      id: usuario.id,
      nome: usuario.nome,
      usuario: usuario.usuario,
      foto: usuario.foto,
      token: `Bearer ${this.jwtService.sign(payload)}`,
    };
  }
}

// import { JwtService } from '@nestjs/jwt';
// import { UsuarioService } from './../../usuario/services/usuario.service';
// import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
// import { Bcrypt } from '../bcrypt/bcrypt';
// import { UsuarioLogin } from '../entities/usuariologin.entity';

// @Injectable()
// export class AuthService {
//   constructor(
//     private usuarioService: UsuarioService,
//     private jwtService: JwtService,
//     private bcrypt: Bcrypt,
//   ) {}

//   async validateUser(username: string, password: string): Promise<any> {
//     const buscaUsuario = await this.usuarioService.findByUsuario(username);

//     if (!buscaUsuario) {
//      return null;
  
//     }

//     const matchPassword = await this.bcrypt.compararSenhas(
//       password,
//       buscaUsuario.senha,
//     );

//     if (matchPassword) {
//       const { senha, ...resposta } = buscaUsuario;
//       return resposta;
//     }

//     return null;
//   }

//   async login(usuarioLogin: UsuarioLogin) {
//     const buscaUsuario = await this.usuarioService.findByUsuario(
//       usuarioLogin.usuario,
//     );

//     if (!buscaUsuario) {
//       throw new HttpException(
//         'Usuário não encontrado!',
//         HttpStatus.NOT_FOUND,
//       );
//     }

//     const payload = { sub: buscaUsuario.usuario };

//     return {
//       id: buscaUsuario.id,
//       nome: buscaUsuario.nome,
//       usuario: buscaUsuario.usuario,
//       senha: '',
//       foto: buscaUsuario.foto,
//       token: `Bearer ${this.jwtService.sign(payload)}`,
//     };
//   }
// }