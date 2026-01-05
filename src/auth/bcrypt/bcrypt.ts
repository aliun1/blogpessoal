import { Injectable } from "@nestjs/common";
import * as bcrypt from 'bcrypt';

@Injectable()
export class Bcrypt{
    
    // criptografar a senha
    async criptografarSenha(senha: string): Promise<string> {
        let saltos: number = 10;
        return await bcrypt.hash(senha, saltos)

    }
    // comparar a senha digitada com a senha do banco
    async compararSenhas(senhaDigitada: string, senhaBanco: string): Promise<boolean> {
        return await bcrypt.compare(senhaDigitada, senhaBanco);
    }

}