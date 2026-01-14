import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  UseGuards,
  Param,
  ParseIntPipe,
} from "@nestjs/common";

import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../../auth/guard/jwt-auth.guard";
import { Usuario } from "../entities/usuario.entity";
import { UsuarioService } from "../services/usuario.service";

@ApiTags('Usuario')
@ApiBearerAuth()
@Controller("/usuarios")
export class UsuarioController {

  constructor(private readonly usuarioService: UsuarioService) {}

  // 🔒 LISTAR TODOS
  @UseGuards(JwtAuthGuard)
  @Get('/all')
  @HttpCode(HttpStatus.OK)
  findAll(): Promise<Usuario[]> {
    return this.usuarioService.findAll();
  }

  // 🔒 BUSCAR POR ID
  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  findById(
    @Param('id', ParseIntPipe) id: number
  ): Promise<Usuario> {
    return this.usuarioService.findById(id);
  }

  // 🔓 CADASTRAR (PÚBLICO)
  @Post('/cadastrar')
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() usuario: Usuario
  ): Promise<Usuario> {
    return this.usuarioService.create(usuario);
  }

  // 🔒 ATUALIZAR
  @UseGuards(JwtAuthGuard)
  @Put('/atualizar')
  @HttpCode(HttpStatus.OK)
  async update(
    @Body() usuario: Usuario
  ): Promise<Usuario> {
    return this.usuarioService.update(usuario);
  }
}